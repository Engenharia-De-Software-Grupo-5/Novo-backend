import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';

@Injectable()
export class ContratoRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<ContractResponse[]> {

    return this.prisma.contratos.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true,
          contracts: true 
        },
        property: {
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
      },
    });
  }
  getById(contractId: string): Promise<ContractResponse> {
    return this.prisma.condominios.contratos.findUnique({
      where: { id: contractId, deletedAt: null },
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true, 
        },
        property: {
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
      },
    });
  }

  checkIfHas(dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.contratos.findUnique({
      where: {ownerId: dto.ownerId, propertyId: dto.propertyId},
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true, 
        },
        property: {
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

      },
    });
  }

  create(dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.condominios.create({
      data: { ...dto },
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true, 
        },
        property: {
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
      },
    });
  }
  update(id: string, dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.condominios.update({
      where: { id: id },
      data: { ...dto },
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true, 
        },
        property: {
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
      },
    });
  }

  delete(contratoId: string): Promise<ContractResponse> {
    return this.prisma.condominios.update({
      where: { id: contratoId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        descricao: true,
        owner: {
          id: true,
          name: true, 
        },
        property: {
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
      },
    });
  }
}
