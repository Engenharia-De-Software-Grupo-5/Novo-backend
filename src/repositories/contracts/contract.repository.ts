import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getById(contractId: string) {
    return this.prisma.contracts.findFirst({
      where: { id: contractId, deletedAt: null },
    });
  }

  async assertContract(contractId: string) {
    const c = await this.getById(contractId);
    if (!c) throw new NotFoundException('Contract not found.');
    return c;
  }

  create(data: {
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
  }) {
    return this.prisma.contracts.create({ data });
  }

  list(params?: { tenantCpf?: string }) {
    return this.prisma.contracts.findMany({
      where: {
        deletedAt: null,
        ...(params?.tenantCpf
          ? {
              leases: {
                some: {
                  tenant: { cpf: params.tenantCpf, deletedAt: null },
                },
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDelete(contractId: string) {
    await this.assertContract(contractId);
    return this.prisma.contracts.update({
      where: { id: contractId },
      data: { deletedAt: new Date() },
    });
  }


  async assertProperty(propertyId: string) {
    const p = await this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null },
      select: { id: true },
    });
    if (!p) throw new NotFoundException('Property not found.');
    return p;
  }

  async assertTenant(tenantId: string) {
    const t = await this.prisma.tenants.findFirst({
      where: { id: tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!t) throw new NotFoundException('Tenant not found.');
    return t;
  }

  async linkLease(contractId: string, propertyId: string, tenantId: string) {
    await this.assertContract(contractId);
    await this.assertProperty(propertyId);
    await this.assertTenant(tenantId);

  
    try {
      return await this.prisma.propertyTenantContractLinks.create({
        data: { contractId, propertyId, tenantId },
      });
    } catch (e: any) {

      throw new ConflictException('Lease link already exists.');
    }
  }

  async unlinkLease(contractId: string, propertyId: string, tenantId: string) {
    await this.assertContract(contractId);
    await this.assertProperty(propertyId);
    await this.assertTenant(tenantId);

    const link = await this.prisma.propertyTenantContractLinks.findFirst({
      where: { contractId, propertyId, tenantId },
      select: { id: true },
    });
    if (!link) throw new NotFoundException('Lease link not found.');

    return this.prisma.propertyTenantContractLinks.delete({ where: { id: link.id } });
  }

  listByTenant(tenantId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, leases: { some: { tenantId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByProperty(propertyId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, leases: { some: { propertyId } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}