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
exports.ContractTemplateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contract_template_dto_1 = require("../../contracts/contract.templates/contract.template.dto");
const contract_template_response_1 = require("../../contracts/contract.templates/contract.template.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const contract_template_service_1 = require("../../services/contract.templates/contract.template.service");
let ContractTemplateController = class ContractTemplateController {
    contractTemplateService;
    constructor(contractTemplateService) {
        this.contractTemplateService = contractTemplateService;
    }
    getAll(name) {
        return this.contractTemplateService.getAll(name);
    }
    getPaginated(data) {
        return this.contractTemplateService.getPaginated(data);
    }
    getById(contractTemplateId) {
        return this.contractTemplateService.getById(contractTemplateId);
    }
    create(dto) {
        return this.contractTemplateService.create(dto);
    }
    update(contractTemplateId, dto) {
        return this.contractTemplateService.update(contractTemplateId, dto);
    }
    delete(contractTemplateId) {
        return this.contractTemplateService.delete(contractTemplateId);
    }
};
exports.ContractTemplateController = ContractTemplateController;
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'name',
        type: String,
        required: false
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get contract templates filtered and paginated',
        description: 'Get contract templates filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(contract_template_response_1.ContractTemplateResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_template_dto_1.ContractTemplateDto]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contract_template_dto_1.ContractTemplateDto]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractTemplateController.prototype, "delete", null);
exports.ContractTemplateController = ContractTemplateController = __decorate([
    (0, swagger_1.ApiTags)('ContractTemplates'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('contracttemplates'),
    __metadata("design:paramtypes", [contract_template_service_1.ContractTemplateService])
], ContractTemplateController);
//# sourceMappingURL=contract.template.controller.js.map