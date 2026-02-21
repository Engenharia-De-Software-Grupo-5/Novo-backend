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
exports.ChargesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let ChargesRepository = class ChargesRepository {
    prisma;
    getPaginated(data) {
        throw new Error('Method not implemented.');
    }
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertTenant(tenantId) {
        const t = await this.prisma.tenants.findFirst({
            where: { id: tenantId, deletedAt: null },
            select: { id: true },
        });
        if (!t)
            throw new common_1.NotFoundException('Tenant not found.');
    }
    async assertProperty(propertyId) {
        const p = await this.prisma.properties.findFirst({
            where: { id: propertyId, deletedAt: null },
            select: { id: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Property not found.');
    }
    isOverdue(dueDate) {
        const now = new Date();
        return now.getTime() > dueDate.getTime();
    }
    async recomputeChargeStatus(chargeId) {
        const charge = await this.prisma.charges.findFirst({
            where: { id: chargeId, deletedAt: null },
            select: { id: true, amount: true, dueDate: true, status: true },
        });
        if (!charge)
            return;
        if (charge.status === client_1.ChargeStatus.CANCELED)
            return;
        const paymentsAgg = await this.prisma.payments.aggregate({
            where: { chargeId, deletedAt: null },
            _sum: { totalPaid: true },
        });
        const totalPaid = paymentsAgg._sum.totalPaid ?? 0;
        let next;
        if (totalPaid >= charge.amount)
            next = client_1.ChargeStatus.PAID;
        else if (this.isOverdue(charge.dueDate))
            next = client_1.ChargeStatus.OVERDUE;
        else
            next = client_1.ChargeStatus.PENDING;
        if (next !== charge.status) {
            await this.prisma.charges.update({
                where: { id: chargeId },
                data: { status: next },
            });
        }
    }
    async create(dto) {
        await this.assertTenant(dto.tenantId);
        await this.assertProperty(dto.propertyId);
        const created = await this.prisma.charges.create({
            data: {
                tenantId: dto.tenantId,
                propertyId: dto.propertyId,
                amount: dto.amount,
                dueDate: new Date(dto.dueDate),
                paymentMethod: dto.paymentMethod,
                fineRate: dto.fineRate ?? 2,
                monthlyRate: dto.monthlyRate ?? 1,
                status: client_1.ChargeStatus.PENDING,
            },
        });
        return created;
    }
    async list(params) {
        const charges = await this.prisma.charges.findMany({
            where: {
                deletedAt: null,
                ...(params?.tenantId ? { tenantId: params.tenantId } : {}),
                ...(params?.propertyId ? { propertyId: params.propertyId } : {}),
                ...(params?.status ? { status: params.status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
        await Promise.all(charges.map((c) => this.recomputeChargeStatus(c.id).catch(() => undefined)));
        return this.prisma.charges.findMany({
            where: {
                deletedAt: null,
                ...(params?.tenantId ? { tenantId: params.tenantId } : {}),
                ...(params?.propertyId ? { propertyId: params.propertyId } : {}),
                ...(params?.status ? { status: params.status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(chargeId) {
        const c = await this.prisma.charges.findFirst({
            where: { id: chargeId, deletedAt: null },
            include: {
                payments: { where: { deletedAt: null }, orderBy: { paymentDate: 'desc' } },
            },
        });
        if (!c)
            throw new common_1.NotFoundException('Charge not found.');
        await this.recomputeChargeStatus(chargeId).catch(() => undefined);
        return this.prisma.charges.findFirst({
            where: { id: chargeId, deletedAt: null },
            include: {
                payments: { where: { deletedAt: null }, orderBy: { paymentDate: 'desc' } },
            },
        });
    }
    async update(chargeId, dto) {
        await this.findOne(chargeId);
        const updated = await this.prisma.charges.update({
            where: { id: chargeId },
            data: {
                ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
                ...(dto.dueDate !== undefined ? { dueDate: new Date(dto.dueDate) } : {}),
                ...(dto.paymentMethod !== undefined ? { paymentMethod: dto.paymentMethod } : {}),
                ...(dto.fineRate !== undefined ? { fineRate: dto.fineRate } : {}),
                ...(dto.monthlyRate !== undefined ? { monthlyRate: dto.monthlyRate } : {}),
            },
        });
        await this.recomputeChargeStatus(chargeId).catch(() => undefined);
        return updated;
    }
    async cancel(chargeId) {
        await this.findOne(chargeId);
        return this.prisma.charges.update({
            where: { id: chargeId },
            data: { status: client_1.ChargeStatus.CANCELED },
        });
    }
    async softDelete(chargeId) {
        await this.findOne(chargeId);
        await this.prisma.charges.update({
            where: { id: chargeId },
            data: { deletedAt: new Date() },
        });
    }
    async recomputeStatusForCharge(chargeId) {
        await this.recomputeChargeStatus(chargeId);
    }
};
exports.ChargesRepository = ChargesRepository;
exports.ChargesRepository = ChargesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChargesRepository);
//# sourceMappingURL=charge.repository.js.map