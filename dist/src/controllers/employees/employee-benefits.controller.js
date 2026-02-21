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
exports.EmployeeBenefitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const employee_benefits_service_1 = require("../../services/employees/employee-benefits.service");
const employeeBenefit_dto_1 = require("../../contracts/employees/employeeBenefit.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const employeeBenefit_response_1 = require("../../contracts/employees/employeeBenefit.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
let EmployeeBenefitsController = class EmployeeBenefitsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(employeeId, dto) {
        return this.service.create(employeeId, dto);
    }
    async listPaginated(employeeId, data) {
        return this.service.listPaginated(employeeId, data);
    }
    async list(employeeId) {
        return this.service.list(employeeId);
    }
    async update(id, employeeId, dto) {
        return this.service.update(id, employeeId, dto);
    }
    async remove(id, employeeId) {
        await this.service.remove(id, employeeId);
    }
};
exports.EmployeeBenefitsController = EmployeeBenefitsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create vacation or 13th salary record' }),
    (0, swagger_1.ApiBody)({ type: employeeBenefit_dto_1.EmployeeBenefitDto }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employeeBenefit_dto_1.EmployeeBenefitDto]),
    __metadata("design:returntype", Promise)
], EmployeeBenefitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get service types filtered and paginated',
        description: 'Get service types filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(employeeBenefit_response_1.EmployeeBenefitResponse),
    }),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], EmployeeBenefitsController.prototype, "listPaginated", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List benefits for employee' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeBenefitsController.prototype, "list", null);
__decorate([
    (0, common_1.Put)(':benefitId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update benefit record' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('benefitId')),
    __param(1, (0, common_1.Param)('employeeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employeeBenefit_dto_1.EmployeeBenefitDto]),
    __metadata("design:returntype", Promise)
], EmployeeBenefitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':benefitId'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete benefit record' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('benefitId')),
    __param(1, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeBenefitsController.prototype, "remove", null);
exports.EmployeeBenefitsController = EmployeeBenefitsController = __decorate([
    (0, swagger_1.ApiTags)('Employee Benefits'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('employees/:employeeId/benefits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employee_benefits_service_1.EmployeeBenefitsService])
], EmployeeBenefitsController);
//# sourceMappingURL=employee-benefits.controller.js.map