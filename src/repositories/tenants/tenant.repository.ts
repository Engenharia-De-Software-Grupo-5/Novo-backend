import { Injectable, NotFoundException } from '@nestjs/common';
import { connect } from 'node:http2';
import { PrismaService } from 'src/common/database/prisma.service';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';
import { TenantDto } from 'src/contracts/tenants/tenant.dto';
import { TenantResponse } from 'src/contracts/tenants/tenant.response';
import { TenantPatchDto } from 'src/contracts/tenants/tenantPatch.dto';

@Injectable()
export class TenantRepository {
  async getPaginated(
    condId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<TenantResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null, condominiumId: condId },
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
      this.prisma.tenants.count({
        where,
      }),
      this.prisma.tenants.findMany({
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
  private readonly tenantSelect = {
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
    address: true,
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

  constructor(private readonly prisma: PrismaService) {}

  getAll(condId: string): Promise<TenantResponse[]> {
    return this.prisma.tenants.findMany({
      where: { deletedAt: null, condominiumId: condId },
      select: this.tenantSelect,
    });
  }
  
  getById(condId: string, tenantId: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { id: tenantId, deletedAt: null, condominiumId: condId },
      select: this.tenantSelect,
    });
  }

  getByCpf(condId: string, cpf: string): Promise<TenantResponse> {
    return this.prisma.tenants.findFirst({
      where: { cpf, deletedAt: null, condominiumId: condId },
      select: this.tenantSelect,
    });
  }

  async create(condId: string, dto: TenantDto): Promise<TenantResponse> {
    const {
      bankingInfo,
      spouse,
      emergencyContacts,
      professionalInfo,
      additionalResidents,
      documents,
      ...rest
    } = dto;

    return this.prisma.tenants.upsert({
      where: { cpf: dto.cpf },

      update: {
        ...rest,
        condominiumId: condId,
        deletedAt: null,

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
        condominium: { connect: { id: condId } },

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

  private buildUpdateData(dto: TenantPatchDto) {
    return {
      ...(dto.maritalStatus && { maritalStatus: dto.maritalStatus }),
      ...(dto.monthlyIncome && { monthlyIncome: dto.monthlyIncome }),
      ...(dto.email && { email: dto.email }),
      ...(dto.primaryPhone && { primaryPhone: dto.primaryPhone }),
      ...(dto.secondaryPhone && { secondaryPhone: dto.secondaryPhone }),
      ...(dto.status && { status: dto.status }),

      ...(dto.emergencyContacts && {
        emergencyContacts: {
          deleteMany: {}, 
          create: dto.emergencyContacts.map(ec => ({
            name: ec.name,
            relationship: ec.relationship,
            phone: ec.phone,
          })),
        },
      }),

      ...(dto.professionalInfo && {
        professionalInfo: {
          upsert: {
            update: {
              companyName: dto.professionalInfo.companyName,
              companyPhone: dto.professionalInfo.companyPhone,
              position: dto.professionalInfo.position,
              monthsWorking: dto.professionalInfo.monthsWorking,
            },
            create: {
              companyName: dto.professionalInfo.companyName,
              companyPhone: dto.professionalInfo.companyPhone,
              position: dto.professionalInfo.position,
              monthsWorking: dto.professionalInfo.monthsWorking,
              companyAddress: {
                connect: { id: dto.professionalInfo.companyAddressId },
              },
            },
          },
        },
      }),

      ...(dto.bankingInfo && {
        bankingInfo: {
          upsert: {
            update: { ...dto.bankingInfo },
            create: { ...dto.bankingInfo },
          },
        },
      }),

      ...(dto.spouse && {
        spouse: {
          upsert: {
            update: { ...dto.spouse },
            create: { ...dto.spouse },
          },
        },
      }),

      ...(dto.additionalResidents && {
        additionalResidents: {
          deleteMany: {},
          create: dto.additionalResidents.map(ar => ({
            name: ar.name,
            relationship: ar.relationship,
            birthDate: ar.birthDate,
          })),
        },
      }),

      ...(dto.documents && {
        documents: {
          upsert: {
            update: { ...dto.documents },
            create: { ...dto.documents },
          },
        },
      }),
    };
  }
  

  async update(condId: string, tenantId: string, dto: TenantPatchDto): Promise<TenantResponse> {
    const tenant = await this.prisma.tenants.findFirst({
      where: {
        id: tenantId,
        condominiumId: condId,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: this.buildUpdateData(dto),
      select: this.tenantSelect,
    });
  }

  async deleteById(condId: string, tenantId: string) {
    const tenant = await this.prisma.tenants.findFirst({
      where: {
        id: tenantId,
        condominiumId: condId,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenants.update({
      where: { id: tenantId },
      data: { deletedAt: new Date() },
      select: this.tenantSelect,
    });
  }
}