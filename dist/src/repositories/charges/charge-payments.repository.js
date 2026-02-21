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
exports.ChargePaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let ChargePaymentsRepository = class ChargePaymentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertCharge(chargeId) {
        const charge = await this.prisma.charges.findFirst({
            where: { id: chargeId, deletedAt: null },
            select: {
                id: true,
                amount: true,
                dueDate: true,
                status: true,
            },
        });
        if (!charge)
            throw new common_1.NotFoundException('Charge not found.');
        return charge;
    }
    async assertPayment(chargeId, paymentId) {
        const payment = await this.prisma.payments.findFirst({
            where: { id: paymentId, chargeId, deletedAt: null },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found.');
        return payment;
    }
    isOverdue(dueDate) {
        return new Date().getTime() > dueDate.getTime();
    }
    async syncChargeStatus(chargeId) {
        const charge = await this.prisma.charges.findFirst({
            where: { id: chargeId, deletedAt: null },
            select: { id: true, amount: true, dueDate: true, status: true },
        });
        if (!charge)
            throw new common_1.NotFoundException('Charge not found.');
        if (charge.status === client_1.ChargeStatus.CANCELED)
            return;
        const agg = await this.prisma.payments.aggregate({
            where: { chargeId, deletedAt: null },
            _sum: { amountPaid: true },
        });
        const paidPrincipal = agg._sum.amountPaid ?? 0;
        let next;
        if (paidPrincipal >= charge.amount)
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
    async createPayment(chargeId, data) {
        const charge = await this.assertCharge(chargeId);
        if (charge.status === client_1.ChargeStatus.CANCELED) {
            throw new common_1.ConflictException('Charge is canceled.');
        }
        if (charge.status === client_1.ChargeStatus.PAID) {
            throw new common_1.ConflictException('Charge is already paid.');
        }
        const created = await this.prisma.payments.create({
            data: {
                chargeId,
                amountPaid: data.amountPaid,
                paymentDate: data.paymentDate,
                method: data.method,
                wasLate: data.calc.wasLate,
                daysLate: data.calc.daysLate,
                fineRate: data.calc.fineRate,
                monthlyRate: data.calc.monthlyRate,
                finePaid: data.calc.finePaid,
                interestPaid: data.calc.interestPaid,
                totalPaid: data.calc.totalPaid,
                proofObjectName: data.proof?.objectName,
                proofOriginalName: data.proof?.originalName,
                proofMimeType: data.proof?.mimeType,
                proofExtension: data.proof?.extension,
                proofSize: data.proof?.size,
            },
        });
        await this.syncChargeStatus(chargeId);
        return created;
    }
    async updatePayment(chargeId, paymentId, data) {
        const charge = await this.assertCharge(chargeId);
        const prev = await this.assertPayment(chargeId, paymentId);
        if (charge.status === client_1.ChargeStatus.CANCELED) {
            throw new common_1.ConflictException('Charge is canceled.');
        }
        const updated = await this.prisma.payments.update({
            where: { id: prev.id },
            data: {
                amountPaid: data.amountPaid,
                paymentDate: data.paymentDate,
                method: data.method,
                wasLate: data.calc.wasLate,
                daysLate: data.calc.daysLate,
                fineRate: data.calc.fineRate,
                monthlyRate: data.calc.monthlyRate,
                finePaid: data.calc.finePaid,
                interestPaid: data.calc.interestPaid,
                totalPaid: data.calc.totalPaid,
                ...(data.proof === null
                    ? {
                        proofObjectName: null,
                        proofOriginalName: null,
                        proofMimeType: null,
                        proofExtension: null,
                        proofSize: null,
                    }
                    : data.proof
                        ? {
                            proofObjectName: data.proof.objectName,
                            proofOriginalName: data.proof.originalName,
                            proofMimeType: data.proof.mimeType,
                            proofExtension: data.proof.extension,
                            proofSize: data.proof.size,
                        }
                        : {}),
            },
        });
        await this.syncChargeStatus(chargeId);
        return { updated, previousProofObject: prev.proofObjectName ?? null };
    }
    listPayments(chargeId) {
        return this.prisma.payments.findMany({
            where: { chargeId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    getPayment(chargeId, paymentId) {
        return this.prisma.payments.findFirst({
            where: { id: paymentId, chargeId, deletedAt: null },
        });
    }
    async softDeletePayment(chargeId, paymentId) {
        const charge = await this.assertCharge(chargeId);
        await this.assertPayment(chargeId, paymentId);
        if (charge.status === client_1.ChargeStatus.CANCELED) {
            throw new common_1.ConflictException('Charge is canceled.');
        }
        await this.prisma.payments.update({
            where: { id: paymentId },
            data: { deletedAt: new Date() },
        });
        await this.syncChargeStatus(chargeId);
        return { message: 'Payment removed successfully.' };
    }
};
exports.ChargePaymentsRepository = ChargePaymentsRepository;
exports.ChargePaymentsRepository = ChargePaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChargePaymentsRepository);
//# sourceMappingURL=charge-payments.repository.js.map