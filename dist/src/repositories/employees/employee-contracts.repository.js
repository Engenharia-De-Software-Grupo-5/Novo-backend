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
exports.EmployeeContractsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmployeeContractsRepository = class EmployeeContractsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    employeeExists(id) {
        return this.prisma.employees.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
    }
    create(data) {
        return this.prisma.employeeContracts.create({ data });
    }
    listByEmployee(employeeId) {
        return this.prisma.employeeContracts.findMany({
            where: { employeeId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    findForEmployee(employeeId, contractId) {
        return this.prisma.employeeContracts.findFirst({
            where: { id: contractId, employeeId, deletedAt: null },
        });
    }
    softDelete(contractId) {
        return this.prisma.employeeContracts.update({
            where: { id: contractId },
            data: { deletedAt: new Date() },
        });
    }
};
exports.EmployeeContractsRepository = EmployeeContractsRepository;
exports.EmployeeContractsRepository = EmployeeContractsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeContractsRepository);
//# sourceMappingURL=employee-contracts.repository.js.map