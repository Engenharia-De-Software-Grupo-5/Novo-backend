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
exports.EmployeePaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmployeePaymentsRepository = class EmployeePaymentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    employeeExists(employeeId) {
        return this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
            select: { id: true },
        });
    }
    create(data) {
        return this.prisma.employeePayments.create({ data });
    }
    listByEmployee(employeeId) {
        return this.prisma.employeePayments.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { paymentDate: 'desc' },
        });
    }
    delete(employeeId, employeePaymentId) {
        return this.prisma.employeePayments.update({
            where: { id: employeePaymentId, employeeId },
            data: { deletedAt: new Date() },
        });
    }
};
exports.EmployeePaymentsRepository = EmployeePaymentsRepository;
exports.EmployeePaymentsRepository = EmployeePaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeePaymentsRepository);
//# sourceMappingURL=employee-payments.repository.js.map