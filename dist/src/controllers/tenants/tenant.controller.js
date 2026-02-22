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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const tenant_dto_1 = require("../../contracts/tenants/tenant.dto");
const tenant_response_1 = require("../../contracts/tenants/tenant.response");
const tenant_service_1 = require("../../services/tenants/tenant.service");
let TenantController = class TenantController {
    tenantService;
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    getAll() {
        return this.tenantService.getAll();
    }
    getPaginated(data) {
        return this.tenantService.getPaginated(data);
    }
    getByCpf(cpf) {
        return this.tenantService.getByCpf(cpf);
    }
    getById(tenantId) {
        return this.tenantService.getById(tenantId);
    }
    create(dto) {
        return this.tenantService.create(dto);
    }
    update(id, dto) {
        return this.tenantService.update(id, dto);
    }
    deleteByCpf(cpf) {
        return this.tenantService.deleteByCpf(cpf);
    }
    delete(tenantId) {
        return this.tenantService.deleteById(tenantId);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all tenants',
        description: 'Retrieve all tenants registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all tenants',
        type: [tenant_response_1.TenantResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contracts filtered and paginated',
        description: 'Get contracts filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(tenant_response_1.TenantResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':cpf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant by CPF',
        description: 'Retrieve details of a specific tenant identified by its CPF.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved tenant details by CPF',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getByCpf", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant by ID',
        description: 'Retrieve details of a specific tenant identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved tenant details',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new tenant',
        description: 'Register a new tenant in the system.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Tenant data to be registered',
        type: tenant_dto_1.TenantDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Tenant successfully created',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_dto_1.TenantDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing tenant',
        description: 'Update the data of an existing tenant identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated tenant data',
        type: tenant_dto_1.TenantDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tenant successfully updated',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.TenantDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':cpf'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete tenant by CPF',
        description: 'Soft delete a specific tenant identified by its CPF.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully deleted tenant by CPF',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Param)('cpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "deleteByCpf", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a tenant',
        description: 'Perform a soft delete of a tenant identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tenant successfully deleted',
        type: tenant_response_1.TenantResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "delete", null);
exports.TenantController = TenantController = __decorate([
    (0, swagger_1.ApiTags)('Tenants'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map