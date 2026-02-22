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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const contract_response_1 = require("../../contracts/contracts/contract.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const contract_service_1 = require("../../services/contracts/contract.service");
let ContractsController = class ContractsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(file) {
        if (!file)
            throw new common_1.BadRequestException('Uploaded file is required.');
        return this.service.upload(file);
    }
    list(tenantCpf) {
        return this.service.list(tenantCpf);
    }
    getPaginated(data) {
        return this.service.listPaginated(data);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    download(id) {
        return this.service.getDownloadUrl(id);
    }
    async remove(id) {
        await this.service.remove(id);
    }
    linkLease(id, tenantId, propertyId) {
        return this.service.linkLease(id, propertyId, tenantId);
    }
    async unlinkLease(id, tenantId, propertyId) {
        await this.service.unlinkLease(id, propertyId, tenantId);
    }
    listByTenant(tenantId) {
        return this.service.listByTenant(tenantId);
    }
    listByProperty(propertyId) {
        return this.service.listByProperty(propertyId);
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a contract (PDF)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: { file: { type: 'string', format: 'binary' } },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List contracts' }),
    (0, swagger_1.ApiQuery)({
        name: 'tenantCpf',
        required: false,
        type: String,
        description: 'Filter contracts by tenant CPF (11 digits)',
        example: '11111111111',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('tenantCpf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contracts filtered and paginated',
        description: 'Get contracts filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(contract_response_1.ContractResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contract details (includes presigned url)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Get download URL (presigned)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete contract' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/leases'),
    (0, swagger_1.ApiOperation)({ summary: 'Link contract to a lease (tenant + property)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['tenantId', 'propertyId'],
            properties: {
                tenantId: { type: 'string', format: 'uuid' },
                propertyId: { type: 'string', format: 'uuid' },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('tenantId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)('propertyId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "linkLease", null);
__decorate([
    (0, common_1.Delete)(':id/leases'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink contract from a lease (tenant + property)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['tenantId', 'propertyId'],
            properties: {
                tenantId: { type: 'string', format: 'uuid' },
                propertyId: { type: 'string', format: 'uuid' },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)('tenantId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Body)('propertyId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "unlinkLease", null);
__decorate([
    (0, common_1.Get)('/by-tenant/:tenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'List contracts linked to tenant' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('tenantId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "listByTenant", null);
__decorate([
    (0, common_1.Get)('/by-property/:propertyId'),
    (0, swagger_1.ApiOperation)({ summary: 'List contracts linked to property (via leases)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('propertyId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "listByProperty", null);
exports.ContractsController = ContractsController = __decorate([
    (0, swagger_1.ApiTags)('Contracts'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('contracts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [contract_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contract.controller.js.map