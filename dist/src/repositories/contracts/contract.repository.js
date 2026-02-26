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
exports.ContractRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let ContractRepository = class ContractRepository {
    prisma;
    selectFields = {
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
        content: true
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    getAll() {
        return this.prisma.contracts.findMany({
            where: { deletedAt: null },
            select: this.selectFields,
        });
    }
    getById(contractId) {
        return this.prisma.contracts.findUnique({
            where: { id: contractId, deletedAt: null },
            select: this.selectFields,
        });
    }
    checkIfHas(dto) {
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
    create(dto) {
        const { file, ...dadosDoContrato } = dto;
        return this.prisma.contracts.create({
            data: { ...dadosDoContrato },
            select: this.selectFields,
        });
    }
    update(id, dto) {
        const { file, ...dadosDoContrato } = dto;
        return this.prisma.contracts.update({
            where: { id: id },
            data: { ...dadosDoContrato },
            select: this.selectFields,
        });
    }
    updateUrl(id, url) {
        return this.prisma.contracts.update({
            where: { id: id },
            data: { contractUrl: url },
            select: this.selectFields,
        });
    }
    delete(contratoId) {
        return this.prisma.contracts.update({
            where: { id: contratoId },
            data: { deletedAt: new Date() },
            select: this.selectFields,
        });
    }
    listByTenant(tenantId) {
        return this.prisma.contracts.findMany({
            where: { deletedAt: null, tenant: { id: tenantId } },
            orderBy: { createdAt: 'desc' },
        });
    }
    listByProperty(propertyId) {
        return this.prisma.contracts.findMany({
            where: { deletedAt: null, property: { id: propertyId } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ContractRepository = ContractRepository;
exports.ContractRepository = ContractRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractRepository);
//# sourceMappingURL=contract.repository.js.map