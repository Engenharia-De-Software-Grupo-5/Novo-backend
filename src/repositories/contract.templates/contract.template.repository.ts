import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { CondominiumResponse } from "src/contracts/condominiums/condominium.response";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { buildDynamicWhere } from "src/contracts/pagination/prisma.utils";

@Injectable()
export class ContractTemplateRepository {
  async getPaginated(
    condominiumId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<ContractTemplateResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null, condominiumId },
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
      this.prisma.contractTemplates.count({
        where,
      }),
      this.prisma.contractTemplates.findMany({
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
  constructor(private prisma: PrismaService) { }

  getById(condominiumId: string, contractTemplateId: string): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.findUnique({
      where: { id: contractTemplateId, condominiumId, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  getAll(condominiumId: string, name?: string): Promise<ContractTemplateResponse[]> {
    return this.prisma.contractTemplates.findMany({
      where: {
        deletedAt: null,
        condominiumId: condominiumId,
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        })
      },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  create(condominiumId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.create({
      data: { name: dto.name, description: dto.description, template: dto.template, condominiumId },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  update(condominiumId: string, contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.update({
      where: { id: contractTemplateId, condominiumId },
      data: { name: dto.name, description: dto.description, template: dto.template },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  delete(condominiumId: string, contractTemplateId: string): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.update({
      where: { id: contractTemplateId, condominiumId },
      data: { deletedAt: new Date() }
    })
  }
}