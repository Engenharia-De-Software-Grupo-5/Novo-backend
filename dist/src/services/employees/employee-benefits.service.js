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
exports.EmployeeBenefitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmployeeBenefitsService = class EmployeeBenefitsService {
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
            throw new common_1.BadRequestException('Invalid value.');
        }
        return this.prisma.employeeBenefits.create({
            data: {
                employeeId,
                type: dto.type,
                referenceYear: dto.referenceYear,
                value: dto.value,
            },
        });
    }
    async listPaginated(employeeId, pagination) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const items = await this.prisma.employeeBenefits.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { referenceYear: 'desc' },
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });
        return {
            items,
            meta: {
                page: pagination.page,
                limit: pagination.limit,
                totalItems: 0,
                totalPages: 0
            },
        };
    }
    async list(employeeId) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        return this.prisma.employeeBenefits.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { referenceYear: 'desc' },
        });
    }
    async update(benefitId, employeeId, dto) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Funcionário não encontrado.');
        const existing = await this.prisma.employeeBenefits.findFirst({
            where: { id: benefitId, employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Registro não encontrado.');
        if (!dto.value || Number.isNaN(dto.value) || dto.value <= 0) {
            throw new common_1.BadRequestException('Valor inválido.');
        }
        return this.prisma.employeeBenefits.update({
            where: { id: benefitId },
            data: {
                type: dto.type,
                referenceYear: dto.referenceYear,
                value: dto.value,
            },
        });
    }
    async remove(benefitId, employeeId) {
        const employee = await this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const existing = await this.prisma.employeeBenefits.findFirst({
            where: { id: benefitId, employeeId, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Record not found.');
        await this.prisma.employeeBenefits.update({
            where: { id: benefitId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Record removed successfully.' };
    }
};
exports.EmployeeBenefitsService = EmployeeBenefitsService;
exports.EmployeeBenefitsService = EmployeeBenefitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeBenefitsService);
//# sourceMappingURL=employee-benefits.service.js.map