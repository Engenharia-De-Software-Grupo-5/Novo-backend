"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let TenantRepository = class TenantRepository {
    prisma;
    async getPaginated(data) {
        const where = (0, prisma_utils_1.buildDynamicWhere)(data, { deletedAt: null }, {
            enumFields: ['status'],
            customMappings: {
                permissionName: (content) => ({
                    permission: { name: { contains: content, mode: 'insensitive' } },
                }),
            },
        });
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
    tenantSelect = {
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll() {
        return this.prisma.tenants.findMany({
            where: { deletedAt: null },
            select: this.tenantSelect,
        });
    }
    getById(tenantId) {
        return this.prisma.tenants.findFirst({
            where: { id: tenantId, deletedAt: null },
            select: this.tenantSelect,
        });
    }
    getByCpf(cpf) {
        return this.prisma.tenants.findFirst({
            where: { cpf, deletedAt: null },
            select: this.tenantSelect,
        });
    }
    async create(dto) {
        const { bankingInfo, spouse, emergencyContacts, professionalInfo, additionalResidents, documents, addressId, condominiumId, ...rest } = dto;
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
    update(tenantId, dto) {
        return this.prisma.tenants.update({
            where: { id: tenantId },
            data: {
                name: dto.name,
                cpf: dto.cpf,
            },
            select: this.tenantSelect,
        });
    }
    deleteByCpf(cpf) {
        return this.prisma.tenants.update({
            where: { cpf, deletedAt: null },
            data: { deletedAt: new Date() },
            select: this.tenantSelect,
        });
    }
    deleteById(tenantId) {
        return this.prisma.tenants.update({
            where: { id: tenantId },
            data: { deletedAt: new Date() },
            select: this.tenantSelect,
        });
    }
};
exports.TenantRepository = TenantRepository;
exports.TenantRepository = TenantRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantRepository);
//# sourceMappingURL=tenant.repository.js.map