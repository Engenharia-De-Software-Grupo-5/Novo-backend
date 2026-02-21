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
exports.CondominiumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const condominium_dto_1 = require("../../contracts/condominiums/condominium.dto");
const condominium_response_1 = require("../../contracts/condominiums/condominium.response");
const pagination_dto_1 = require("../../contracts/pagination/pagination.dto");
const swagger_paginated_schema_1 = require("../../contracts/pagination/swagger.paginated.schema");
const condominium_service_1 = require("../../services/condominiums/condominium.service");
let CondominiumController = class CondominiumController {
    condominiumService;
    constructor(condominiumService) {
        this.condominiumService = condominiumService;
    }
    getAll() {
        return this.condominiumService.getAll();
    }
    getPaginated(data) {
        return this.condominiumService.getPaginated(data);
    }
    getById(condominioId) {
        return this.condominiumService.getById(condominioId);
    }
    create(dto) {
        return this.condominiumService.create(dto);
    }
    update(id, dto) {
        return this.condominiumService.update(id, dto);
    }
    delete(condominiumId) {
        return this.condominiumService.delete(condominiumId);
    }
};
exports.CondominiumController = CondominiumController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all condominiums',
        description: 'Retrieve all condominiums registered in the system.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved all condominiums',
        type: [condominium_response_1.CondominiumResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('paginated'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get condominiums filtered and paginated',
        description: 'Get condominiums filtered and paginated',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        schema: (0, swagger_paginated_schema_1.PaginatedResponseSchema)(condominium_response_1.CondominiumResponse),
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get condominium by ID',
        description: 'Retrieve details of a specific condominium identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Successfully retrieved condominium details',
        type: condominium_response_1.CondominiumResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new condominium',
        description: 'Register a new condominium in the system.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Condominium data to be registered',
        type: condominium_dto_1.CondominiumDto,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Condominium successfully created',
        type: condominium_response_1.CondominiumResponse,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [condominium_dto_1.CondominiumDto]),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing condominium',
        description: 'Update the data of an existing condominium identified by its ID.',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Updated condominium data',
        type: condominium_dto_1.CondominiumDto,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Condominium successfully updated',
        type: condominium_response_1.CondominiumResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, condominium_dto_1.CondominiumDto]),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a condominium',
        description: 'Perform a soft delete of a condominium identified by its ID.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Condominium successfully deleted',
        type: condominium_response_1.CondominiumResponse,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CondominiumController.prototype, "delete", null);
exports.CondominiumController = CondominiumController = __decorate([
    (0, swagger_1.ApiTags)('Condominiums'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('condominiums'),
    __metadata("design:paramtypes", [condominium_service_1.CondominiumService])
], CondominiumController);
//# sourceMappingURL=condominium.controller.js.map