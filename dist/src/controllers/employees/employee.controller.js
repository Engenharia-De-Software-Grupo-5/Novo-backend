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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employee_dto_1 = require("../../contracts/employees/employee.dto");
const employee_response_1 = require("../../contracts/employees/employee.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const employee_service_1 = require("../../services/employees/employee.service");
let EmployeeController = class EmployeeController {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    getAll() {
        return this.employeeService.getAll();
    }
    getPaginated(data) {
        return this.employeeService.getPaginated(data);
    }
    getByCpf(cpf) {
        return this.employeeService.getByCpf(cpf);
    }
    getById(employeeId) {
        return this.employeeService.getById(employeeId);
    }
    create(dto) {
        return this.employeeService.create(dto);
    }
    update(id, dto) {
        return this.employeeService.update(id, dto);
    }
    updateByCpf(cpf, dto) {
        return this.employeeService.updateByCpf(cpf, dto);
    }
    delete(employeeId) {
        return this.employeeService.delete(employeeId);
    }
    deleteByCpf(cpf) {
        return this.employeeService.deleteByCpf(cpf);
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all employees',
        description: 'Retrieve all employees registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all employees',
        type: [employee_response_1.EmployeeResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get employees filtered and paginated',
        description: 'Get employees filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(employee_response_1.EmployeeResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':cpf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List employee by CPF',
        description: 'Retrieve employee registered in the system by CPF.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved employee',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getByCpf", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get employee by ID',
        description: 'Retrieve details of a specific employee identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved employee details',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new employee',
        description: 'Register a new employee in the system.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Employee data to be registered',
        type: employee_dto_1.EmployeeDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Employee successfully created',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.EmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing employee',
        description: 'Update the data of an existing employee identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated employee data',
        type: employee_dto_1.EmployeeDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Employee successfully updated',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.EmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':cpf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing employee',
        description: 'Update the data of an existing employee identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated employee data',
        type: employee_dto_1.EmployeeDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Employee successfully updated',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('cpf')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.EmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateByCpf", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a employee',
        description: 'Perform a soft delete of a employee identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Employee successfully deleted',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)(':cpf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a employee by CPF',
        description: 'Perform a soft delete of a employee identified by its CPF.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Employee successfully deleted',
        type: employee_response_1.EmployeeResponse,
    }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "deleteByCpf", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map