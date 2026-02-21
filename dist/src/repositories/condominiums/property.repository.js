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
exports.PropertyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let PropertyRepository = class PropertyRepository {
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
            this.prisma.properties.count({
                where,
            }),
            this.prisma.properties.findMany({
                where,
                omit: {
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                },
                take: data.limit,
                skip: (data.page - 1) * data.limit,
                orderBy: { identifier: 'asc' },
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
    propertySelect = {
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
    };
    getAll(condominiumId) {
        return this.prisma.properties.findMany({
            where: { deletedAt: null, condominiumId },
            select: {
                ...this.propertySelect
            },
        });
    }
    getById(condominiumId, propertyId) {
        return this.prisma.properties.findFirst({
            where: { id: propertyId, deletedAt: null, condominiumId },
            select: {
                ...this.propertySelect
            },
        });
    }
    getByIdentificador(condominiumId, identifier) {
        return this.prisma.properties.findUnique({
            where: { identifier, condominiumId, deletedAt: null },
            select: {
                ...this.propertySelect
            },
        });
    }
    create(condominiumId, dto) {
        return this.prisma.properties.create({
            data: { ...dto, condominiumId },
            select: {
                ...this.propertySelect
            },
        });
    }
    update(condominiumId, propertyId, dto) {
        return this.prisma.properties.update({
            where: { id: propertyId, condominiumId, deletedAt: null },
            data: { ...dto },
            select: {
                ...this.propertySelect
            },
        });
    }
    delete(condominiumId, propertyId) {
        return this.prisma.properties.update({
            where: { id: propertyId, condominiumId },
            data: { deletedAt: new Date() },
            select: {
                ...this.propertySelect
            },
        });
    }
};
exports.PropertyRepository = PropertyRepository;
exports.PropertyRepository = PropertyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyRepository);
//# sourceMappingURL=property.repository.js.map