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
exports.EmployeeBenefitsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmployeeBenefitsRepository = class EmployeeBenefitsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findEmployeeById(employeeId) {
        return this.prisma.employees.findFirst({
            where: { id: employeeId, deletedAt: null },
        });
    }
    create(data) {
        return this.prisma.employeeBenefits.create({ data });
    }
    findByEmployee(employeeId) {
        return this.prisma.employeeBenefits.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { referenceYear: 'desc' },
        });
    }
    findById(id) {
        return this.prisma.employeeBenefits.findFirst({
            where: { id, deletedAt: null },
        });
    }
    update(id, data) {
        return this.prisma.employeeBenefits.update({
            where: { id },
            data,
        });
    }
    softDelete(id) {
        return this.prisma.employeeBenefits.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.EmployeeBenefitsRepository = EmployeeBenefitsRepository;
exports.EmployeeBenefitsRepository = EmployeeBenefitsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeBenefitsRepository);
//# sourceMappingURL=employee-benefits.repository.js.map