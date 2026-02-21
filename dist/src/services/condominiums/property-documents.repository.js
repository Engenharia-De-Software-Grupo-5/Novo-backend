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
exports.PropertyDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const minio_client_service_1 = require("../tools/minio-client.service");
const property_documents_repository_1 = require("../../repositories/condominiums/property-documents.repository");
let PropertyDocumentsService = class PropertyDocumentsService {
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
        const objectName = `condominiums/${condominiumId}/properties/${propertyId}/documents/${(0, crypto_1.randomUUID)()}.${extension}`;
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
    async findOne(condominiumId, propertyId, documentId) {
        const doc = await this.repo.findOne(condominiumId, propertyId, documentId);
        const url = await this.minio.getFileUrl(doc.objectName);
        return { ...doc, url };
    }
    async getDownloadUrl(condominiumId, propertyId, documentId) {
        const doc = await this.repo.findOne(condominiumId, propertyId, documentId);
        const url = await this.minio.getFileUrl(doc.objectName);
        return { url };
    }
    async remove(condominiumId, propertyId, documentId) {
        const doc = await this.repo.findOne(condominiumId, propertyId, documentId);
        try {
            await this.minio.deleteFile(doc.objectName);
        }
        catch {
        }
        await this.repo.softDelete(condominiumId, propertyId, documentId);
    }
};
exports.PropertyDocumentsService = PropertyDocumentsService;
exports.PropertyDocumentsService = PropertyDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [property_documents_repository_1.PropertyDocumentsRepository,
        minio_client_service_1.MinioClientService])
], PropertyDocumentsService);
//# sourceMappingURL=property-documents.repository.js.map