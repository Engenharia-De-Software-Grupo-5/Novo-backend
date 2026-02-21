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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const employee_repository_1 = require("../../repositories/employees/employee.repository");
let EmployeeService = class EmployeeService {
    employeeRepository;
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    getAll() {
        return this.employeeRepository.getAll();
    }
    getPaginated(data) {
        return this.employeeRepository.getPaginated(data);
    }
    getById(employeeId) {
        return this.employeeRepository.getById(employeeId);
    }
    getByCpf(cpf) {
        return this.employeeRepository.getByCpf(cpf);
    }
    async create(dto) {
        const employeeExistente = await this.employeeRepository.getByCpf(dto.cpf);
        if (!!employeeExistente) {
            throw new common_1.BadRequestException('This CPF already exists in the database.');
        }
        return this.employeeRepository.create(dto);
    }
    update(id, dto) {
        return this.employeeRepository.update(id, dto);
    }
    updateByCpf(cpf, dto) {
        return this.employeeRepository.updateByCpf(cpf, dto);
    }
    delete(employeeId) {
        return this.employeeRepository.delete(employeeId);
    }
    deleteByCpf(cpf) {
        return this.employeeRepository.deleteByCpf(cpf);
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_repository_1.EmployeeRepository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map