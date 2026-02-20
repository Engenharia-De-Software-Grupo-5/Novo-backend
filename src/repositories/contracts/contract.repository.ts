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

  // asserts
  async assertEmployee(employeeId: string) {
    const e = await this.prisma.employees.findFirst({
      where: { id: employeeId, deletedAt: null },
      select: { id: true },
    });
    if (!e) throw new NotFoundException('Employee not found.');
    return e;
  }

  async assertCondominium(condominiumId: string) {
    const c = await this.prisma.condominiums.findFirst({
      where: { id: condominiumId, deletedAt: null },
      select: { id: true },
    });
    if (!c) throw new NotFoundException('Condominium not found.');
    return c;
  }

  async assertProperty(propertyId: string) {
    const p = await this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null },
      select: { id: true, condominiumId: true },
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

  async linkEmployee(contractId: string, employeeId: string) {
    await this.assertContract(contractId);
    await this.assertEmployee(employeeId);
    try {
      return await this.prisma.employeeContractLinks.create({
        data: { contractId, employeeId },
      });
    } catch {
      throw new ConflictException('Link already exists.');
    }
  }

  async unlinkEmployee(contractId: string, employeeId: string) {
    await this.assertContract(contractId);
    await this.assertEmployee(employeeId);

    const link = await this.prisma.employeeContractLinks.findFirst({
      where: { contractId, employeeId },
    });
    if (!link) throw new NotFoundException('Link not found.');

    return this.prisma.employeeContractLinks.delete({ where: { id: link.id } });
  }

  async linkCondominium(contractId: string, condominiumId: string) {
    await this.assertContract(contractId);
    await this.assertCondominium(condominiumId);
    try {
      return await this.prisma.condominiumContractLinks.create({
        data: { contractId, condominiumId },
      });
    } catch {
      throw new ConflictException('Link already exists.');
    }
  }

  async unlinkCondominium(contractId: string, condominiumId: string) {
    await this.assertContract(contractId);
    await this.assertCondominium(condominiumId);

    const link = await this.prisma.condominiumContractLinks.findFirst({
      where: { contractId, condominiumId },
    });
    if (!link) throw new NotFoundException('Link not found.');

    return this.prisma.condominiumContractLinks.delete({ where: { id: link.id } });
  }

  async linkProperty(contractId: string, propertyId: string) {
    await this.assertContract(contractId);
    await this.assertProperty(propertyId);
    try {
      return await this.prisma.propertyContractLinks.create({
        data: { contractId, propertyId },
      });
    } catch {
      throw new ConflictException('Link already exists.');
    }
  }

  async unlinkProperty(contractId: string, propertyId: string) {
    await this.assertContract(contractId);
    await this.assertProperty(propertyId);

    const link = await this.prisma.propertyContractLinks.findFirst({
      where: { contractId, propertyId },
    });
    if (!link) throw new NotFoundException('Link not found.');

    return this.prisma.propertyContractLinks.delete({ where: { id: link.id } });
  }

  
  async linkLease(contractId: string, propertyId: string, tenantId: string) {
    await this.assertContract(contractId);
    const property = await this.assertProperty(propertyId);
    await this.assertTenant(tenantId);


    if (property.condominiumId) {
      await this.prisma.condominiumContractLinks.upsert({
        where: {
          contractId_condominiumId: { contractId, condominiumId: property.condominiumId },
        },
        create: { contractId, condominiumId: property.condominiumId },
        update: {},
      });
    }

    try {
      return await this.prisma.propertyTenantContractLinks.create({
        data: { contractId, propertyId, tenantId },
      });
    } catch {
      throw new ConflictException('Lease link already exists.');
    }
  }

  async unlinkLease(contractId: string, propertyId: string, tenantId: string) {
    await this.assertContract(contractId);
    await this.assertProperty(propertyId);
    await this.assertTenant(tenantId);

    const link = await this.prisma.propertyTenantContractLinks.findFirst({
      where: { contractId, propertyId, tenantId },
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

  listByEmployee(employeeId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, employeesLinks: { some: { employeeId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByCondominium(condominiumId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, condominiumsLinks: { some: { condominiumId } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}