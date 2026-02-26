import { Injectable } from '@nestjs/common';
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

  constructor(private prisma: PrismaService) { }

  // getAll, getById, create, update, delete
  getAll(): Promise<ContractResponse[]> {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null },
      select: this.selectFields,
    });
  }

  getById(contractId: string): Promise<ContractResponse> {
    return this.prisma.contracts.findUnique({
      where: { id: contractId, deletedAt: null },
      select: this.selectFields,
    });
  }

  checkIfHas(dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.contracts.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId: dto.tenantId,
          propertyId: dto.propertyId,
        },
      },
      select: this.selectFields,
    });
  }

  create(dto: ContractDto): Promise<ContractResponse> {
    const { file, ...dadosDoContrato } = dto;

    return this.prisma.contracts.create({
      data: { ...dadosDoContrato },
      select: this.selectFields,
    });
  }

  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    const { file, ...dadosDoContrato } = dto;
    return this.prisma.contracts.update({
      where: { id: id },
      data: { ...dadosDoContrato },
      select: this.selectFields,
    });
  }

  updateUrl(id: string, url: string): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: { id: id },
      data: { contractUrl: url },
      select: this.selectFields,
    });
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: { id: contratoId },
      data: { deletedAt: new Date() },
      select: this.selectFields,
    });
  }

  listByTenant(tenantId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, tenant: { id: tenantId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByProperty(propertyId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, property: { id: propertyId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
