import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';

@Injectable()
export class ContractsRepository {
  async getPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ContractResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null },
      {
        enumFields: ['status'], 
        customMappings: {
          permissionName: (content) => ({
            permission: { name: { contains: content, mode: 'insensitive' } },
          }),
        },
      },
    );

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.contracts.count({
        where,
      }),
      this.prisma.contracts.findMany({
        where,
        omit: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / data.limit),
        page: data.page,
        limit: data.limit,
      },
    };
  }
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