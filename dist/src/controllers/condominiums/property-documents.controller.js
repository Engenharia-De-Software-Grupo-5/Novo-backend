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
exports.PropertyDocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const property_documents_repository_1 = require("../../services/condominiums/property-documents.repository");
let PropertyDocumentsController = class PropertyDocumentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async upload(condominiumId, propertyId, file) {
        if (!file)
            throw new common_1.BadRequestException('Envie um arquivo no campo "file".');
        return this.service.upload(condominiumId, propertyId, file);
    }
    async list(condominiumId, propertyId) {
        return this.service.list(condominiumId, propertyId);
    }
    async findOne(condominiumId, propertyId, documentId) {
        return this.service.findOne(condominiumId, propertyId, documentId);
    }
    async download(condominiumId, propertyId, documentId) {
        return this.service.getDownloadUrl(condominiumId, propertyId, documentId);
    }
    async remove(condominiumId, propertyId, documentId) {
        await this.service.remove(condominiumId, propertyId, documentId);
    }
};
exports.PropertyDocumentsController = PropertyDocumentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload a property document',
        description: 'Upload a new document linked to a property.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PropertyDocumentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List property documents' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PropertyDocumentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document details' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __param(2, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PropertyDocumentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':documentId/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download document (signed URL)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __param(2, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PropertyDocumentsController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete document (soft delete)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('condominiumId')),
    __param(1, (0, common_1.Param)('propertyId')),
    __param(2, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PropertyDocumentsController.prototype, "remove", null);
exports.PropertyDocumentsController = PropertyDocumentsController = __decorate([
    (0, swagger_1.ApiTags)('Property Documents'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('condominiums/:condominiumId/properties/:propertyId/documents'),
    __metadata("design:paramtypes", [property_documents_repository_1.PropertyDocumentsService])
], PropertyDocumentsController);
//# sourceMappingURL=property-documents.controller.js.map