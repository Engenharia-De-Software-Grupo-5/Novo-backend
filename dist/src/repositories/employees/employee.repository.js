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
exports.EmployeeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const prisma_utils_1 = require("../../contracts/pagination/prisma.utils");
let EmployeeRepository = class EmployeeRepository {
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
            this.prisma.employees.count({
                where,
            }),
            this.prisma.employees.findMany({
                where,
                include: {
                    bankData: true,
                },
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
    employeeSelect = {
        id: true,
        cpf: true,
        name: true,
        bankData: true,
        role: true,
        contractType: true,
        hireDate: true,
        baseSalary: true,
        workload: true,
        status: true,
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll() {
        return this.prisma.employees.findMany({
            where: { deletedAt: null },
            select: this.employeeSelect,
        });
    }
    getById(employeeId) {
        return this.prisma.employees.findUnique({
            where: { id: employeeId, deletedAt: null },
            select: this.employeeSelect,
        });
    }
    getByCpf(cpf) {
        return this.prisma.employees.findUnique({
            where: { cpf, deletedAt: null },
            select: this.employeeSelect,
        });
    }
    async create(dto) {
        const { bankData, ...rest } = dto;
        return this.prisma.employees.upsert({
            where: {
                cpf: dto.cpf,
            },
            update: {
                ...rest,
                deletedAt: null,
            },
            create: {
                ...rest,
                bankData: {
                    create: {}
                }
            },
            select: this.employeeSelect,
        });
    }
    update(id, dto) {
        return this.prisma.employees.update({
            where: { id: id },
            data: { ...dto, deletedAt: null },
            select: this.employeeSelect,
        });
    }
    updateByCpf(cpf, dto) {
        return this.prisma.employees.update({
            where: { cpf },
            data: { ...dto, deletedAt: null },
            select: this.employeeSelect,
        });
    }
    delete(employeeId) {
        return this.prisma.employees.update({
            where: { id: employeeId, deletedAt: null },
            data: { deletedAt: new Date() },
            select: this.employeeSelect,
        });
    }
    deleteByCpf(cpf) {
        return this.prisma.employees.update({
            where: { cpf, deletedAt: null },
            data: { deletedAt: new Date() },
            select: this.employeeSelect,
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeRepository);
//# sourceMappingURL=employee.repository.js.map