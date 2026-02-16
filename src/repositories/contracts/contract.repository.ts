import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';

@Injectable()
export class ContractRepository {

  private readonly selectFields = {
    id: true,
        descricao: true,
        owner: {
          select: {
            id: true,
            identifier: true,
          }
        },
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
          }
        }
  }

  constructor(private prisma: PrismaService) {}

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
        ownerId_propertyId: {
          ownerId: dto.ownerId,
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
      data: { ...dto },
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
}
