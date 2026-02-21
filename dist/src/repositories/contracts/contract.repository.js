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
exports.ContractsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let ContractsRepository = class ContractsRepository {
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
            this.prisma.contracts.count({
                where,
            }),
            this.prisma.contracts.findMany({
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    getById(contractId) {
        return this.prisma.contracts.findFirst({
            where: { id: contractId, deletedAt: null },
        });
    }
    async assertContract(contractId) {
        const c = await this.getById(contractId);
        if (!c)
            throw new common_1.NotFoundException('Contract not found.');
        return c;
    }
    create(data) {
        return this.prisma.contracts.create({ data });
    }
    list(params) {
        return this.prisma.contracts.findMany({
            where: {
                deletedAt: null,
                ...(params?.tenantCpf
                    ? {
                        leases: {
                            some: {
                                tenant: { cpf: params.tenantCpf, deletedAt: null },
                            },
                        },
                    }
                    : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async softDelete(contractId) {
        await this.assertContract(contractId);
        return this.prisma.contracts.update({
            where: { id: contractId },
            data: { deletedAt: new Date() },
        });
    }
    async assertProperty(propertyId) {
        const p = await this.prisma.properties.findFirst({
            where: { id: propertyId, deletedAt: null },
            select: { id: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Property not found.');
        return p;
    }
    async assertTenant(tenantId) {
        const t = await this.prisma.tenants.findFirst({
            where: { id: tenantId, deletedAt: null },
            select: { id: true },
        });
        if (!t)
            throw new common_1.NotFoundException('Tenant not found.');
        return t;
    }
    async linkLease(contractId, propertyId, tenantId) {
        await this.assertContract(contractId);
        await this.assertProperty(propertyId);
        await this.assertTenant(tenantId);
        try {
            return await this.prisma.propertyTenantContractLinks.create({
                data: { contractId, propertyId, tenantId },
            });
        }
        catch (e) {
            throw new common_1.ConflictException('Lease link already exists.');
        }
    }
    async unlinkLease(contractId, propertyId, tenantId) {
        await this.assertContract(contractId);
        await this.assertProperty(propertyId);
        await this.assertTenant(tenantId);
        const link = await this.prisma.propertyTenantContractLinks.findFirst({
            where: { contractId, propertyId, tenantId },
            select: { id: true },
        });
        if (!link)
            throw new common_1.NotFoundException('Lease link not found.');
        return this.prisma.propertyTenantContractLinks.delete({ where: { id: link.id } });
    }
    listByTenant(tenantId) {
        return this.prisma.contracts.findMany({
            where: { deletedAt: null, leases: { some: { tenantId } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    listByProperty(propertyId) {
        return this.prisma.contracts.findMany({
            where: { deletedAt: null, leases: { some: { propertyId } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ContractsRepository = ContractsRepository;
exports.ContractsRepository = ContractsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsRepository);
//# sourceMappingURL=contract.repository.js.map