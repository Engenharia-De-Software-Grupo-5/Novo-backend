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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const property_dto_1 = require("../../contracts/condominiums/property.dto");
const property_response_1 = require("../../contracts/condominiums/property.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const property_service_1 = require("../../services/condominiums/property.service");
let PropertyController = class PropertyController {
    propertyService;
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    getAll(condominiumId) {
        return this.propertyService.getAll(condominiumId);
    }
    getPaginated(data) {
        return this.propertyService.getPaginated(data);
    }
    getById(condominiumId, propertyId) {
        return this.propertyService.getById(condominiumId, propertyId);
    }
    create(condominiumId, dto) {
        return this.propertyService.create(condominiumId, dto);
    }
    update(condominiumId, propertyId, dto) {
        return this.propertyService.update(condominiumId, propertyId, dto);
    }
    delete(condominiumId, propertyId) {
        return this.propertyService.delete(condominiumId, propertyId);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all properties',
        description: 'Retrieve all properties registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all properties',
        type: [property_response_1.PropertyResponse],
    }),
    __param(0, (0, common_1.Param)('condominiumId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get properties filtered and paginated',
        description: 'Get properties filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(property_response_1.PropertyResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':propertyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get property by ID',
        description: 'Retrieve a specific property by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved the property',
        type: property_response_1.PropertyResponse,
    }),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new property',
        description: 'Create a new property in the system.',
    }),
    (0, swagger_1.ApiBody)({ type: property_dto_1.PropertyDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Successfully created the property',
        type: property_response_1.PropertyResponse,
    }),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, property_dto_1.PropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':propertyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a property',
        description: 'Update an existing property in the system.',
    }),
    (0, swagger_1.ApiBody)({ type: property_dto_1.PropertyDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully updated the property',
        type: property_response_1.PropertyResponse,
    }),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, property_dto_1.PropertyDto]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':propertyId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a property',
        description: 'Delete an existing property from the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully deleted the property',
        type: property_response_1.PropertyResponse,
    }),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "delete", null);
exports.PropertyController = PropertyController = __decorate([
    (0, swagger_1.ApiTags)('properties'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('condominiums/:condominiumId/properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map