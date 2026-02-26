import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";

@Injectable()
export class ContractTemplateRepository {
  constructor(private readonly prisma: PrismaService) { }

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