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
exports.PropertyInspectionsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let PropertyInspectionsRepository = class PropertyInspectionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertPropertyOwned(condominiumId, propertyId) {
        const property = await this.prisma.properties.findFirst({
            where: { id: propertyId, condominiumId, deletedAt: null },
            select: { id: true, condominiumId: true },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found.');
        }
        return property;
    }
    create(data) {
        const { condominiumId: _condId, ...payload } = data;
        return this.prisma.propertyInspections.create({
            data: payload,
        });
    }
    async list(condominiumId, propertyId) {
        await this.assertPropertyOwned(condominiumId, propertyId);
        return this.prisma.propertyInspections.findMany({
            where: { propertyId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(condominiumId, propertyId, inspectionId) {
        await this.assertPropertyOwned(condominiumId, propertyId);
        const inspection = await this.prisma.propertyInspections.findFirst({
            where: {
                id: inspectionId,
                propertyId,
                deletedAt: null,
            },
        });
        if (!inspection) {
            throw new common_1.NotFoundException('Inspection not found.');
        }
        return inspection;
    }
    async softDelete(condominiumId, propertyId, inspectionId) {
        await this.findOne(condominiumId, propertyId, inspectionId);
        await this.prisma.propertyInspections.update({
            where: { id: inspectionId },
            data: { deletedAt: new Date() },
        });
    }
};
exports.PropertyInspectionsRepository = PropertyInspectionsRepository;
exports.PropertyInspectionsRepository = PropertyInspectionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyInspectionsRepository);
//# sourceMappingURL=property-inspections.repository.js.map