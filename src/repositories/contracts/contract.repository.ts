import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';

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
        rg: true,
        issuingAuthority: true,
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
            rg: true,
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
        address: true,
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
    content: true
  };

  constructor(private prisma: PrismaService) { }

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
        select: this.selectFields,
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