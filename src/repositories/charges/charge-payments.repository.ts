import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ChargeStatus } from '@prisma/client';

@Injectable()
export class ChargePaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assertCharge(chargeId: string) {
    const charge = await this.prisma.charges.findFirst({
      where: { id: chargeId, deletedAt: null },
      select: {
        id: true,
        amount: true,
        dueDate: true,
        status: true,
      },
    });

    if (!charge) throw new NotFoundException('Charge not found.');
    return charge;
  }

  async assertPayment(chargeId: string, paymentId: string) {
    const payment = await this.prisma.payments.findFirst({
      where: { id: paymentId, chargeId, deletedAt: null },
    });
    if (!payment) throw new NotFoundException('Payment not found.');
    return payment;
  }

  private isOverdue(dueDate: Date) {
    return new Date().getTime() > dueDate.getTime();
  }

  /**
   * Status automático:
   * - CANCELED: não altera
   * - PAID: soma(amountPaid) >= charge.amount
   * - OVERDUE: hoje > dueDate e não pago/cancelado
   * - PENDING: caso contrário
   */
  async syncChargeStatus(chargeId: string) {
    const charge = await this.prisma.charges.findFirst({
      where: { id: chargeId, deletedAt: null },
      select: { id: true, amount: true, dueDate: true, status: true },
    });

    if (!charge) throw new NotFoundException('Charge not found.');

    // Se cancelada, não mexe
    if (charge.status === ChargeStatus.CANCELED) return;

    const agg = await this.prisma.payments.aggregate({
      where: { chargeId, deletedAt: null },
      _sum: { amountPaid: true },
    });

    const paidPrincipal = agg._sum.amountPaid ?? 0;

    let next: ChargeStatus;

    if (paidPrincipal >= charge.amount) next = ChargeStatus.PAID;
    else if (this.isOverdue(charge.dueDate)) next = ChargeStatus.OVERDUE;
    else next = ChargeStatus.PENDING;

    if (next !== charge.status) {
      await this.prisma.charges.update({
        where: { id: chargeId },
        data: { status: next },
      });
    }
  }

  async createPayment(
    chargeId: string,
    data: {
      amountPaid: number;
      paymentDate: Date;
      method: any;
      calc: {
        wasLate: boolean;
        daysLate: number;
        fineRate: number;
        monthlyRate: number;
        finePaid: number;
        interestPaid: number;
        totalPaid: number;
      };
      proof?: {
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
      };
    },
  ) {
    const charge = await this.assertCharge(chargeId);

    if (charge.status === ChargeStatus.CANCELED) {
      throw new ConflictException('Charge is canceled.');
    }

    //  evita registrar pagamento numa charge já paga
    if (charge.status === ChargeStatus.PAID) {
      throw new ConflictException('Charge is already paid.');
    }

    const created = await this.prisma.payments.create({
      data: {
        chargeId,
        amountPaid: data.amountPaid,
        paymentDate: data.paymentDate,
        method: data.method,

        wasLate: data.calc.wasLate,
        daysLate: data.calc.daysLate,

        fineRate: data.calc.fineRate,
        monthlyRate: data.calc.monthlyRate,
        finePaid: data.calc.finePaid,
        interestPaid: data.calc.interestPaid,
        totalPaid: data.calc.totalPaid,

        proofObjectName: data.proof?.objectName,
        proofOriginalName: data.proof?.originalName,
        proofMimeType: data.proof?.mimeType,
        proofExtension: data.proof?.extension,
        proofSize: data.proof?.size,
      },
    });

    await this.syncChargeStatus(chargeId);
    return created;
  }

  async updatePayment(
    chargeId: string,
    paymentId: string,
    data: {
      amountPaid: number;
      paymentDate: Date;
      method: any;
      calc: {
        wasLate: boolean;
        daysLate: number;
        fineRate: number;
        monthlyRate: number;
        finePaid: number;
        interestPaid: number;
        totalPaid: number;
      };
      proof?: {
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
      } | null;
    },
  ) {
    const charge = await this.assertCharge(chargeId);
    const prev = await this.assertPayment(chargeId, paymentId);

    if (charge.status === ChargeStatus.CANCELED) {
      throw new ConflictException('Charge is canceled.');
    }

    const updated = await this.prisma.payments.update({
      where: { id: prev.id },
      data: {
        amountPaid: data.amountPaid,
        paymentDate: data.paymentDate,
        method: data.method,

        wasLate: data.calc.wasLate,
        daysLate: data.calc.daysLate,
        fineRate: data.calc.fineRate,
        monthlyRate: data.calc.monthlyRate,
        finePaid: data.calc.finePaid,
        interestPaid: data.calc.interestPaid,
        totalPaid: data.calc.totalPaid,

        ...(data.proof === null
          ? {
              proofObjectName: null,
              proofOriginalName: null,
              proofMimeType: null,
              proofExtension: null,
              proofSize: null,
            }
          : data.proof
          ? {
              proofObjectName: data.proof.objectName,
              proofOriginalName: data.proof.originalName,
              proofMimeType: data.proof.mimeType,
              proofExtension: data.proof.extension,
              proofSize: data.proof.size,
            }
          : {}),
      },
    });

    await this.syncChargeStatus(chargeId);
    return { updated, previousProofObject: prev.proofObjectName ?? null };
  }

  listPayments(chargeId: string) {
    return this.prisma.payments.findMany({
      where: { chargeId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  getPayment(chargeId: string, paymentId: string) {
    return this.prisma.payments.findFirst({
      where: { id: paymentId, chargeId, deletedAt: null },
    });
  }

  async softDeletePayment(chargeId: string, paymentId: string) {
    const charge = await this.assertCharge(chargeId);
    await this.assertPayment(chargeId, paymentId);

    if (charge.status === ChargeStatus.CANCELED) {
      throw new ConflictException('Charge is canceled.');
    }

    await this.prisma.payments.update({
      where: { id: paymentId },
      data: { deletedAt: new Date() },
    });

    await this.syncChargeStatus(chargeId);
    return { message: 'Payment removed successfully.' };
  }
}