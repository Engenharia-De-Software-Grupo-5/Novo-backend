import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";

@Injectable()
export class ContractTemplateRepository {
  constructor(private prisma: PrismaService) { }

  getById(contractTemplateId: string): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.findUnique({
      where: { id: contractTemplateId, deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  getAll(name?: string): Promise<ContractTemplateResponse[]> {
    return this.prisma.contractTemplates.findMany({
      where: {
        deletedAt: null,
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

  create(dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.create({
      data: { name: dto.name, description: dto.description, template: dto.template },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  update(contractTemplateId: string, dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.update({
      where: { id: contractTemplateId },
      data: { name: dto.name, description: dto.description, template: dto.template },
      select: {
        id: true,
        name: true,
        description: true,
        template: true
      }
    })
  }

  delete(contractTemplateId: string): Promise<ContractTemplateResponse> {
    return this.prisma.contractTemplates.update({
      where: { id: contractTemplateId },
      data: { deletedAt: new Date() }
    })
  }
}