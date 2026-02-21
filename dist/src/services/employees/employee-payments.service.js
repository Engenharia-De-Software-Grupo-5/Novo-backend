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
exports.EmployeePaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmployeePaymentsService = class EmployeePaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(employeeId, dto) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        if (!dto.value || Number.isNaN(dto.value) || dto.value <= 0) {
            throw new common_1.BadRequestException('Invalid payment value.');
        }
        const paymentDate = new Date(dto.paymentDate);
        if (Number.isNaN(paymentDate.getTime())) {
            throw new common_1.BadRequestException('Invalid payment date.');
        }
        if (paymentDate > new Date()) {
            throw new common_1.BadRequestException('Payment date cannot be in the future.');
        }
        const created = await this.prisma.employeePayments.create({
            data: {
                employeeId,
                value: dto.value,
                paymentDate,
                type: dto.type,
            },
            select: {
                id: true,
                value: true,
                paymentDate: true,
                type: true,
            },
        });
        return {
            id: created.id,
            value: created.value,
            paymentDate: created.paymentDate.toISOString().slice(0, 10),
            type: created.type,
        };
    }
    async list(employeeId) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const rows = await this.prisma.employeePayments.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { paymentDate: 'desc' },
            select: {
                id: true,
                value: true,
                paymentDate: true,
                type: true,
            },
        });
        return rows.map((p) => ({
            id: p.id,
            value: p.value,
            paymentDate: p.paymentDate.toISOString().slice(0, 10),
            type: p.type,
        }));
    }
    async delete(employeeId, employeePaymentId) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const payment = await this.prisma.employeePayments.findFirst({
            where: { id: employeePaymentId, employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!payment)
            throw new common_1.NotFoundException('Employee payment not found.');
        await this.prisma.employeePayments.update({
            where: { id: employeePaymentId },
            data: { deletedAt: new Date() },
        });
    }
};
exports.EmployeePaymentsService = EmployeePaymentsService;
exports.EmployeePaymentsService = EmployeePaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeePaymentsService);
//# sourceMappingURL=employee-payments.service.js.map