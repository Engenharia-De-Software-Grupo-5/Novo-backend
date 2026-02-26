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
exports.ContractController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const contract_dto_1 = require("../../contracts/contracts/contract.dto");
const contract_response_1 = require("../../contracts/contracts/contract.response");
const preview_contract_dto_1 = require("../../contracts/contracts/preview.contract.dto");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const contract_service_1 = require("../../services/contracts/contract.service");
const preview_contract_service_1 = require("../../services/contracts/preview.contract.service");
let ContractController = class ContractController {
    contractService;
    previewContractService;
    constructor(contractService, previewContractService) {
        this.contractService = contractService;
        this.previewContractService = previewContractService;
    }
    getAll() {
        return this.contractService.getAll();
    }
    getPaginated(data) {
        return this.contractService.listPaginated(data);
    }
    getById(ContratoId) {
        return this.contractService.getById(ContratoId);
    }
    async createWithFile(dto, file) {
        return this.contractService.create(dto, file);
    }
    update(id, dto) {
        return this.contractService.update(id, dto);
    }
    delete(ContractId) {
        return this.contractService.delete(ContractId);
    }
    async preview(dto) {
        return this.previewContractService.execute(dto);
    }
};
exports.ContractController = ContractController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all contracts',
        description: 'Retrieve all contracts registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all contracts',
        type: [contract_response_1.ContractResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "getAll", null);
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
], ContractController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contract by ID',
        description: 'Retrieve details of a specific contract identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved contract details',
        type: contract_response_1.ContractResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create contract with (optional) PDF upload' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    nullable: true,
                },
                tenantId: { type: 'string' },
                propertyId: { type: 'string' },
                contractTemplateId: { type: 'string' },
                description: { type: 'string' },
            },
            required: ['tenantId', 'propertyId', 'contractTemplateId'],
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_dto_1.ContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "createWithFile", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing contract',
        description: 'Update the data of an existing contract identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated contract data',
        type: contract_dto_1.ContractDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'contract successfully updated',
        type: contract_response_1.ContractResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contract_dto_1.ContractDto]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a contract',
        description: 'Perform a soft delete of a contract identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'contract successfully deleted',
        type: contract_response_1.ContractResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview contract before creation',
        description: 'Generate a temporary HTML preview of the contract',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preview_contract_dto_1.PreviewContractDto]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "preview", null);
exports.ContractController = ContractController = __decorate([
    (0, swagger_1.ApiTags)('Contracts'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('contracts'),
    __metadata("design:paramtypes", [contract_service_1.ContractService,
        preview_contract_service_1.PreviewContractService])
], ContractController);
//# sourceMappingURL=contract.controller.js.map