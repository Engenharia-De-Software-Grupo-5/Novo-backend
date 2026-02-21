import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';

@Injectable()
export class TenantRepository {
  private readonly tenantSelect = {
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
          }
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
      }
    }
  };

  constructor(private prisma: PrismaService) {}

  getAll(): Promise<TenantResponse[]> {
    return this.prisma.tenants.findMany({
      where: { deletedAt: null },
      select: this.tenantSelect,
    });
  }
  getById(tenantId: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { id: tenantId, deletedAt: null },
      select: this.tenantSelect,
    });
  }

  getByCpf(cpf: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { cpf, deletedAt: null },
      select: this.tenantSelect,
    });
  }

  async create(dto: TenantDto): Promise<TenantResponse> {
    const {
      bankingInfo,
      spouse,
      emergencyContacts,
      professionalInfo,
      additionalResidents,
      documents,
      addressId,
      condominiumId,
      ...rest
    } = dto;

    return this.prisma.tenants.upsert({
      where: { cpf: dto.cpf },

      update: {
        ...rest,
        condominiumId,
        deletedAt: null,

        address: {
          connect: { id: addressId },
        },

        spouse: spouse
          ? {
              upsert: {
                create: spouse,
                update: spouse,
              },
            }
          : undefined,

        bankingInfo: bankingInfo
          ? {
              upsert: {
                create: bankingInfo,
                update: bankingInfo,
              },
            }
          : undefined,

        professionalInfo: professionalInfo
          ? {
              upsert: {
                create: {
                  companyName: professionalInfo.companyName,
                  companyPhone: professionalInfo.companyPhone,
                  position: professionalInfo.position,
                  monthsWorking: professionalInfo.monthsWorking,
                  addressId: professionalInfo.companyAddressId,
                },
                update: {
                  companyName: professionalInfo.companyName,
                  companyPhone: professionalInfo.companyPhone,
                  position: professionalInfo.position,
                  monthsWorking: professionalInfo.monthsWorking,
                  addressId: professionalInfo.companyAddressId,
                },
              },
            }
          : undefined,

        documents: documents
          ? {
              upsert: {
                create: documents,
                update: documents,
              },
            }
          : undefined,

        emergencyContacts: emergencyContacts
          ? {
              deleteMany: {},
              create: emergencyContacts,
            }
          : undefined,

        additionalResidents: additionalResidents
          ? {
              deleteMany: {},
              create: additionalResidents,
            }
          : undefined,
      },

      create: {
        ...rest,
        condominiumId,

        address: {
          connect: { id: addressId },
        },

        spouse: spouse ? { create: spouse } : undefined,
        bankingInfo: bankingInfo ? { create: bankingInfo } : undefined,

        professionalInfo: professionalInfo
          ? {
              create: {
                companyName: professionalInfo.companyName,
                companyPhone: professionalInfo.companyPhone,
                position: professionalInfo.position,
                monthsWorking: professionalInfo.monthsWorking,
                addressId: professionalInfo.companyAddressId,
              },
            }
          : undefined,

        emergencyContacts: emergencyContacts
          ? { create: emergencyContacts }
          : undefined,

        additionalResidents: additionalResidents
          ? { create: additionalResidents }
          : undefined,

        documents: documents ? { create: documents } : undefined,
      },

      select: this.tenantSelect,
    });
  }
  

  update(tenantId: string, dto: TenantDto): Promise<TenantResponse> {
    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: {
        name: dto.name,
        cpf: dto.cpf,
      },
      select: this.tenantSelect,
    });
  }

  deleteByCpf(cpf: string): Promise<TenantResponse> {
    return this.prisma.tenants.update({
      where: { cpf, deletedAt: null },
      data: { deletedAt: new Date() },
      select: this.tenantSelect,
    });
  }

  deleteById(tenantId: string): Promise<TenantResponse> {
    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: { deletedAt: new Date() },
      select: this.tenantSelect,
    });
  }
}