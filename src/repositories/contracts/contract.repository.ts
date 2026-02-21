import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';

@Injectable()
export class ContractRepository {

  private readonly selectFields = {
        id: true,
        contractUrl: true,
        description: true,
        property: {
          select: {
            id: true,
            identifier: true,
            address: true,
            unityNumber: true,
            unityType: true,
            block: true,
            floor: true,
            totalArea: true,
            propertySituation: true,
            observations: true,
            condominium: {
              select: {
                id: true,
                name: true,
                description: true,
                address: {
                  select: {
                    id: true,
                    zip: true,
                    neighborhood: true,
                    city: true,
                    complement: true,
                    number: true,
                    street: true,
                    uf: true,
                  },
                },
              }
            }
          }
        },
        contractTemplate: {
          select: {
            id: true,
            name: true,
            description: true,
            template: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            cpf: true,
          }
        }
  }

  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<ContractResponse[]> {

    return this.prisma.contracts.findMany({
      where: { deletedAt: null },
      select: this.selectFields
        })
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
          propertyId: dto.propertyId
        }
      },
      select: this.selectFields,
    });
  }

  create(dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.contracts.create({
      data: { ...dto },
      select: this.selectFields,
    });
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: { id: id },
      data: { ...dto},
      select: this.selectFields,
    });
  }

  updateUrl(id: string, url: string): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: { id: id },
      data: { contractUrl: url},
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
      where: { deletedAt: null, tenant: { id: tenantId }},
      orderBy: { createdAt: 'desc' },
    });
  }

  listByProperty(propertyId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, property: { id: propertyId }},
      orderBy: { createdAt: 'desc' },
    });
  }
}
