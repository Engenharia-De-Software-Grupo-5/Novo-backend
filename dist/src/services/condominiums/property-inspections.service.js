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
exports.PropertyInspectionsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const minio_client_service_1 = require("../tools/minio-client.service");
const property_inspections_repository_1 = require("../../repositories/condominiums/property-inspections.repository");
let PropertyInspectionsService = class PropertyInspectionsService {
    repo;
    minio;
    allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    constructor(repo, minio) {
        this.repo = repo;
        this.minio = minio;
    }
    async upload(condominiumId, propertyId, file) {
        await this.repo.assertPropertyOwned(condominiumId, propertyId);
        const extension = (file.originalname.split('.').pop() || '').toLowerCase();
        const objectName = `condominiums/${condominiumId}/properties/${propertyId}/inspections/${(0, crypto_1.randomUUID)()}.${extension}`;
        const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);
        return this.repo.create({
            condominiumId,
            propertyId,
            objectName: fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension,
            size: file.size,
        });
    }
    list(condominiumId, propertyId) {
        return this.repo.list(condominiumId, propertyId);
    }
    async findOne(condominiumId, propertyId, inspectionId) {
        const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);
        const url = await this.minio.getFileUrl(inspection.objectName);
        return { ...inspection, url };
    }
    async getDownloadUrl(condominiumId, propertyId, inspectionId) {
        const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);
        const url = await this.minio.getFileUrl(inspection.objectName);
        return { url };
    }
    async remove(condominiumId, propertyId, inspectionId) {
        const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);
        try {
            await this.minio.deleteFile(inspection.objectName);
        }
        catch {
        }
        await this.repo.softDelete(condominiumId, propertyId, inspectionId);
    }
};
exports.PropertyInspectionsService = PropertyInspectionsService;
exports.PropertyInspectionsService = PropertyInspectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [property_inspections_repository_1.PropertyInspectionsRepository,
        minio_client_service_1.MinioClientService])
], PropertyInspectionsService);
//# sourceMappingURL=property-inspections.service.js.map