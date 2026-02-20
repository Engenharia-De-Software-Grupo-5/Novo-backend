import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    ownerCpf?: string;
  }) {
    return this.prisma.contracts.create({ data });
  }

  list(params?: { ownerCpf?: string }) {
    return this.prisma.contracts.findMany({
      where: {
        deletedAt: null,
        ...(params?.ownerCpf ? { ownerCpf: params.ownerCpf } : {}),
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
      select: { id: true },
    });
    if (!p) throw new NotFoundException('Property not found.');
    return p;
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

  listByEmployee(employeeId: string) {
    return this.prisma.contracts.findMany({
      where: {
        deletedAt: null,
        employeesLinks: { some: { employeeId } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByCondominium(condominiumId: string) {
    return this.prisma.contracts.findMany({
      where: {
        deletedAt: null,
        condominiumsLinks: { some: { condominiumId } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}