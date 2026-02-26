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
    content: true,
    property: {
      select: {
        id: true,
        identifier: true,
        unityNumber: true,
        unityType: true,
        propertySituation: true,
        observations: true,
        propertyAddress: {
          select: {
            id: true,
            zip: true,
            neighborhood: true,
            city: true,
            number: true,
            street: true,
            uf: true,
            block: true,
            floor: true,
            totalArea: true,
          },
        },
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
          },
        },
      },
    },
    contractTemplate: {
      select: {
        id: true,
        name: true,
        description: true,
        template: true,
      },
    },
    tenant: {
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        birthDate: true,
        maritalStatus: true,
        monthlyIncome: true,
        primaryPhone: true,
        secondaryPhone: true,
        status: true,
        condominiumId: true,
        spouse: {
          select: {
            id: true,
            name: true,
            birthDate: true,
            cpf: true,
            profession: true,
            monthlyIncome: true,
          },
        },
        professionalInfo: {
          select: {
            id: true,
            companyName: true,
            companyAddress: {
              select: {
                id: true,
                street: true,
                number: true,
                city: true,
                zip: true,
                uf: true,
                neighborhood: true,
                complement: true,
              },
            },
            companyPhone: true,
            position: true,
            monthsWorking: true,
          },
        },
        additionalResidents: {
          select: {
            id: true,
            name: true,
            birthDate: true,
            relationship: true,
          },
        },
        emergencyContacts: {
          select: {
            id: true,
            name: true,
            phone: true,
            relationship: true,
          },
        },
        documents: {
          select: {
            id: true,
            cpfFileId: true,
            incomeProofId: true,
          },
        },
        address: {
          select: {
            id: true,
            street: true,
            neighborhood: true,
            number: true,
            city: true,
            zip: true,
            uf: true,
            complement: true,
          },
        },
        bankingInfo: {
          select: {
            id: true,
            bank: true,
            accountNumber: true,
            agency: true,
            accountType: true,
          },
        },
      },
    },
    startDate: true,
    dueDate: true,
  };

  constructor(private prisma: PrismaService) { }

  // getAll, getById, create, update, delete
  getAll(condominiumId: string): Promise<ContractResponse[]> {
    return this.prisma.contracts.findMany({
      where: {
        deletedAt: null,
        property: { condominiumId },
      },
      select: this.selectFields,
    });
  }

  getById(condominiumId: string, contractId: string): Promise<ContractResponse> {
    return this.prisma.contracts.findUnique({
      where: {
        id: contractId, deletedAt: null,
        property: { condominiumId },
      },
      select: this.selectFields,
    });
  }

  checkIfHas(condominiumId: string, dto: ContractDto): Promise<ContractResponse> {
    return this.prisma.contracts.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId: dto.tenantId,
          propertyId: dto.propertyId,
        },
        property: { condominiumId },
      },
      select: this.selectFields,
    });
  }

  async create(condominiumId: string, dto: ContractDto): Promise<ContractResponse> {
    const { file, ...dadosDoContrato } = dto;

    const property = await this.prisma.properties.findFirst({
      where: {
        id: dto.propertyId,
        condominiumId,
      },
    });

    if (!property) {
      throw new Error("Property não pertence a esse condomínio");
    }

    const data: any = {
      description: dadosDoContrato.description,
      content: dadosDoContrato.content,
      startDate: dadosDoContrato.startDate,
      dueDate: dadosDoContrato.dueDate,
      tenant: { connect: { id: dto.tenantId } },
      property: { connect: { id: dto.propertyId } },
    };

    if (dto.contractTemplateId) {
      data.contractTemplate = { connect: { id: dto.contractTemplateId } };
    }

    return this.prisma.contracts.create({
      data,
      select: this.selectFields,
    });
  }

  update(condominiumId: string, contractId: string, dto: ContractDto): Promise<ContractResponse> {
    const { file, ...dadosDoContrato } = dto;
    return this.prisma.contracts.update({
      where: {
        id: contractId,
        property: { condominiumId },
      },
      data: { ...dadosDoContrato },
      select: this.selectFields,
    });
  }

  updateUrl(condominiumId: string, contractId: string, url: string): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: {
        id: contractId,
        property: { condominiumId },
      },
      data: { contractUrl: url },
      select: this.selectFields,
    });
  }

  delete(condominiumId: string, contractId: string): Promise<ContractResponse> {
    return this.prisma.contracts.update({
      where: {
        id: contractId,
        property: { condominiumId },
      },
      data: { deletedAt: new Date() },
      select: this.selectFields,
    });
  }

  listByTenant(condominiumId: string, tenantId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, tenant: { id: tenantId }, property: { condominiumId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  listByProperty(condominiumId: string, propertyId: string) {
    return this.prisma.contracts.findMany({
      where: { deletedAt: null, property: { id: propertyId, condominiumId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
