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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contract_repository_1 = require("../../repositories/contracts/contract.repository");
const minio_client_service_1 = require("../tools/minio-client.service");
let ContractsService = class ContractsService {
    repo;
    minio;
    allowedExtensions = ['pdf'];
    constructor(repo, minio) {
        this.repo = repo;
        this.minio = minio;
    }
    async upload(file) {
        const ext = (file.originalname.split('.').pop() || '').toLowerCase();
        if (ext !== 'pdf')
            throw new common_1.UnsupportedMediaTypeException('Only PDF files are allowed.');
        const objectName = `contracts/${(0, crypto_1.randomUUID)()}.pdf`;
        const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);
        return this.repo.create({
            objectName: fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension: 'pdf',
            size: file.size,
        });
    }
    listPaginated(data) {
        return this.repo.getPaginated(data);
    }
    list(tenantCpf) {
        return this.repo.list({ tenantCpf });
    }
    async findOne(contractId) {
        const c = await this.repo.getById(contractId);
        if (!c)
            throw new common_1.NotFoundException('Contract not found.');
        const url = await this.minio.getFileUrl(c.objectName);
        return { ...c, url };
    }
    async getDownloadUrl(contractId) {
        const c = await this.repo.getById(contractId);
        if (!c)
            throw new common_1.NotFoundException('Contract not found.');
        const url = await this.minio.getFileUrl(c.objectName);
        return { url };
    }
    async remove(contractId) {
        const c = await this.repo.getById(contractId);
        if (!c)
            throw new common_1.NotFoundException('Contract not found.');
        try {
            await this.minio.deleteFile(c.objectName);
        }
        catch { }
        await this.repo.softDelete(contractId);
    }
    linkLease(contractId, propertyId, tenantId) {
        return this.repo.linkLease(contractId, propertyId, tenantId);
    }
    unlinkLease(contractId, propertyId, tenantId) {
        return this.repo.unlinkLease(contractId, propertyId, tenantId);
    }
    listByTenant(tenantId) {
        return this.repo.listByTenant(tenantId);
    }
    listByProperty(propertyId) {
        return this.repo.listByProperty(propertyId);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contract_repository_1.ContractsRepository,
        minio_client_service_1.MinioClientService])
], ContractsService);
//# sourceMappingURL=contract.service.js.map