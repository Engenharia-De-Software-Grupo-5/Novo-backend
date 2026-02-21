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
exports.CondominiumRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let CondominiumRepository = class CondominiumRepository {
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
            this.prisma.condominiums.count({
                where,
            }),
            this.prisma.condominiums.findMany({
                include: {
                    address: true,
                    properties: true,
                },
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
    condominiumSelect = {
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
        properties: {
            where: { deletedAt: null },
            select: {
                id: true,
                identifier: true,
                address: true,
                totalArea: true,
                unityNumber: true,
                unityType: true,
                block: true,
                floor: true,
                propertySituation: true,
                observations: true,
            },
        },
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll() {
        return this.prisma.condominiums.findMany({
            where: { deletedAt: null },
            select: this.condominiumSelect,
        });
    }
    getById(condominiumId) {
        return this.prisma.condominiums.findFirst({
            where: { id: condominiumId, deletedAt: null },
            select: this.condominiumSelect,
        });
    }
    getByName(name) {
        return this.prisma.condominiums.findFirst({
            where: { name, deletedAt: null },
            select: this.condominiumSelect,
        });
    }
    create(dto) {
        return this.prisma.condominiums.create({
            data: { ...dto, address: { create: dto.address } },
            select: this.condominiumSelect,
        });
    }
    update(id, dto) {
        return this.prisma.condominiums.update({
            where: { id: id },
            data: { ...dto, address: { update: { ...dto.address } } },
            select: this.condominiumSelect,
        });
    }
    delete(condominiumId) {
        return this.prisma.condominiums.update({
            where: { id: condominiumId },
            data: { deletedAt: new Date() },
            select: this.condominiumSelect,
        });
    }
};
exports.CondominiumRepository = CondominiumRepository;
exports.CondominiumRepository = CondominiumRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CondominiumRepository);
//# sourceMappingURL=condominium.repository.js.map