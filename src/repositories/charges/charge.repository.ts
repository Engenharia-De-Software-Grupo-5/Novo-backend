import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ChargeStatus } from '@prisma/client';
import { ChargeDto } from 'src/contracts/charges/charge.dto';
import { UpdateChargeDto } from 'src/contracts/charges/charge-update.dto';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';

@Injectable()
export class ChargesRepository {
  getPaginated(condominiumId: string, data: PaginationDto): Promise<import("../../contracts/pagination/paginated.result").PaginatedResult<import("../../contracts/condominiums/property.response").PropertyResponse>> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) { }

  private async assertTenant(condominiumId: string, tenantId: string) {
    const t = await this.prisma.tenants.findFirst({
      where: { id: tenantId, deletedAt: null, condominiumId },
      select: { id: true },
    });
    if (!t) throw new NotFoundException('Tenant not found.');
  }

  private async assertProperty(condominiumId: string, propertyId: string) {
    const p = await this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null, condominiumId },
      select: { id: true },
    });
    if (!p) throw new NotFoundException('Property not found.');
  }

  private isOverdue(dueDate: Date) {
    const now = new Date();
    return now.getTime() > dueDate.getTime();
  }

  private async recomputeChargeStatus(condominiumId: string, chargeId: string) {
    const charge = await this.prisma.charges.findFirst({
      where: { id: chargeId, deletedAt: null, property: { condominiumId } },
      select: { id: true, amount: true, dueDate: true, status: true },
    });

    if (!charge) return;


    if (charge.status === ChargeStatus.CANCELED) return;

    const paymentsAgg = await this.prisma.payments.aggregate({
      where: { chargeId, deletedAt: null },
      _sum: { totalPaid: true },
    });

    const totalPaid = paymentsAgg._sum.totalPaid ?? 0;

    let next: ChargeStatus;
    if (totalPaid >= charge.amount) next = ChargeStatus.PAID;
    else if (this.isOverdue(charge.dueDate)) next = ChargeStatus.OVERDUE;
    else next = ChargeStatus.PENDING;

    if (next !== charge.status) {
      await this.prisma.charges.update({
        where: { id: chargeId },
        data: { status: next },
      });
    }
  }

  async create(condominiumId: string, dto: ChargeDto) {
    await this.assertTenant(condominiumId, dto.tenantId);
    await this.assertProperty(condominiumId, dto.propertyId);

    const created = await this.prisma.charges.create({
      data: {
        tenantId: dto.tenantId,
        propertyId: dto.propertyId,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        paymentMethod: dto.paymentMethod,
        fineRate: dto.fineRate ?? 2,
        monthlyRate: dto.monthlyRate ?? 1,
        status: ChargeStatus.PENDING,
      },
    });

    return created;
  }

  async list(params?: { condominiumId?: string; tenantId?: string; propertyId?: string; status?: ChargeStatus }) {
    const charges = await this.prisma.charges.findMany({
      where: {
        deletedAt: null,
        ...(params?.condominiumId ? { property: { condominiumId: params.condominiumId } } : {}),
        ...(params?.tenantId ? { tenantId: params.tenantId } : {}),
        ...(params?.propertyId ? { propertyId: params.propertyId } : {}),
        ...(params?.status ? { status: params.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });


    await Promise.all(charges.map((c) => this.recomputeChargeStatus(params.condominiumId, c.id).catch(() => undefined)));


    return this.prisma.charges.findMany({
      where: {
        deletedAt: null,
        ...(params?.tenantId ? { tenantId: params.tenantId } : {}),
        ...(params?.propertyId ? { propertyId: params.propertyId } : {}),
        ...(params?.status ? { status: params.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(condominiumId: string, chargeId: string) {
    const c = await this.prisma.charges.findFirst({
      where: { id: chargeId, deletedAt: null, property: { condominiumId } },
      include: {
        payments: { where: { deletedAt: null }, orderBy: { paymentDate: 'desc' } },
      },
    });
    if (!c) throw new NotFoundException('Charge not found.');

    await this.recomputeChargeStatus(condominiumId, chargeId).catch(() => undefined);

    return this.prisma.charges.findFirst({
      where: { id: chargeId, deletedAt: null },
      include: {
        payments: { where: { deletedAt: null }, orderBy: { paymentDate: 'desc' } },
      },
    });
  }

  async update(condominiumId: string, chargeId: string, dto: UpdateChargeDto) {
    await this.findOne(condominiumId, chargeId);

    const updated = await this.prisma.charges.update({
      where: { id: chargeId },
      data: {
        ...(dto.amount === undefined ? {} : { amount: dto.amount }),
        ...(dto.dueDate === undefined ? {} : { dueDate: new Date(dto.dueDate) }),
        ...(dto.paymentMethod === undefined ? {} : { paymentMethod: dto.paymentMethod }),
        ...(dto.fineRate === undefined ? {} : { fineRate: dto.fineRate }),
        ...(dto.monthlyRate === undefined ? {} : { monthlyRate: dto.monthlyRate }),
      },
    });

    await this.recomputeChargeStatus(condominiumId, chargeId).catch(() => undefined);
    return updated;
  }

  async cancel(condominiumId: string, chargeId: string) {
    await this.findOne(condominiumId, chargeId);
    return this.prisma.charges.update({
      where: { id: chargeId },
      data: { status: ChargeStatus.CANCELED },
    });
  }

  async softDelete(condominiumId: string, chargeId: string) {
    await this.findOne(condominiumId, chargeId);

    await this.prisma.charges.update({
      where: { id: chargeId },
      data: { deletedAt: new Date() },
    });
  }

  async recomputeStatusForCharge(condominiumId: string, chargeId: string) {
    await this.recomputeChargeStatus(condominiumId, chargeId);
  }
}