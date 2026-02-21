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
exports.ExpenseRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let ExpenseRepository = class ExpenseRepository {
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
            this.prisma.expenses.count({
                where,
            }),
            this.prisma.expenses.findMany({
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
    async assertTargetExists(input) {
        const { targetType, condominiumId, propertyId } = input;
        if (condominiumId && propertyId) {
            throw new common_1.BadRequestException('condominiumId and propertyId cannot be provided at the same time.');
        }
        if (targetType === client_1.ExpenseTargetType.CONDOMINIUM) {
            if (!condominiumId)
                throw new common_1.BadRequestException('condominiumId is required.');
            const condo = await this.prisma.condominiums.findFirst({
                where: { id: condominiumId, deletedAt: null },
                select: { id: true },
            });
            if (!condo)
                throw new common_1.NotFoundException('Condominium not found.');
            return { condominiumId, propertyId: null };
        }
        if (targetType === client_1.ExpenseTargetType.PROPERTY) {
            if (!propertyId)
                throw new common_1.BadRequestException('propertyId is required.');
            const prop = await this.prisma.properties.findFirst({
                where: { id: propertyId, deletedAt: null },
                select: { id: true },
            });
            if (!prop)
                throw new common_1.NotFoundException('Property not found.');
            return { propertyId, condominiumId: null };
        }
        throw new common_1.BadRequestException('targetType invalid.');
    }
    async create(input) {
        const target = await this.assertTargetExists(input);
        return this.prisma.expenses.create({
            data: {
                targetType: input.targetType,
                condominiumId: target.condominiumId,
                propertyId: target.propertyId,
                expenseType: input.expenseType,
                value: input.value,
                expenseDate: input.expenseDate,
                paymentMethod: input.paymentMethod,
            },
        });
    }
    findAll() {
        return this.prisma.expenses.findMany({
            where: { deletedAt: null },
            orderBy: { expenseDate: 'desc' },
            include: { invoices: { where: { deletedAt: null } } },
        });
    }
    async findByIdOrThrow(id) {
        const exp = await this.prisma.expenses.findFirst({
            where: { id, deletedAt: null },
            include: { invoices: { where: { deletedAt: null } } },
        });
        if (!exp)
            throw new common_1.NotFoundException('Expense not found.');
        return exp;
    }
    async update(id, input) {
        await this.findByIdOrThrow(id);
        const target = await this.assertTargetExists(input);
        return this.prisma.expenses.update({
            where: { id },
            data: {
                targetType: input.targetType,
                condominiumId: target.condominiumId,
                propertyId: target.propertyId,
                expenseType: input.expenseType,
                value: input.value,
                expenseDate: input.expenseDate,
                paymentMethod: input.paymentMethod,
            },
        });
    }
    async softDelete(id) {
        await this.findByIdOrThrow(id);
        return this.prisma.$transaction(async (tx) => {
            await tx.invoices.updateMany({
                where: { expenseId: id, deletedAt: null },
                data: { deletedAt: new Date() },
            });
            await tx.expenses.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
            return { message: 'Expense removed successfully.' };
        });
    }
};
exports.ExpenseRepository = ExpenseRepository;
exports.ExpenseRepository = ExpenseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseRepository);
//# sourceMappingURL=expense.repository.js.map