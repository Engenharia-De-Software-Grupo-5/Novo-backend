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
exports.EmployeeContractsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const employee_contracts_repository_1 = require("../../repositories/employees/employee-contracts.repository");
const minio_client_service_1 = require("../tools/minio-client.service");
let EmployeeContractsService = class EmployeeContractsService {
    repo;
    minio;
    allowedExtensions = ['pdf'];
    constructor(repo, minio) {
        this.repo = repo;
        this.minio = minio;
    }
    async upload(employeeId, file) {
        const employee = await this.repo.employeeExists(employeeId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        const extension = (file.originalname.split('.').pop() || '').toLowerCase();
        if (extension !== 'pdf') {
            throw new common_1.UnsupportedMediaTypeException('Only PDF files are allowed.');
        }
        const objectName = `employees/${employeeId}/contracts/${(0, node_crypto_1.randomUUID)()}.pdf`;
        const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);
        return this.repo.create({
            employeeId,
            objectName: fileName,
            originalName: file.originalname,
            mimeType: file.mimetype,
            extension: 'pdf',
            size: file.size,
        });
    }
    async list(employeeId) {
        const employee = await this.repo.employeeExists(employeeId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found.');
        return this.repo.listByEmployee(employeeId);
    }
    async findOne(employeeId, contractId) {
        const contract = await this.repo.findForEmployee(employeeId, contractId);
        if (!contract)
            throw new common_1.NotFoundException('Contract not found.');
        const url = await this.minio.getFileUrl(contract.objectName);
        return { ...contract, url };
    }
    async getDownloadUrl(employeeId, contractId) {
        const contract = await this.repo.findForEmployee(employeeId, contractId);
        if (!contract)
            throw new common_1.NotFoundException('Contract not found.');
        const url = await this.minio.getFileUrl(contract.objectName);
        return { url };
    }
    async remove(employeeId, contractId) {
        const contract = await this.repo.findForEmployee(employeeId, contractId);
        if (!contract)
            throw new common_1.NotFoundException('Contract not found.');
        try {
            await this.minio.deleteFile(contract.objectName);
        }
        catch {
        }
        await this.repo.softDelete(contractId);
    }
};
exports.EmployeeContractsService = EmployeeContractsService;
exports.EmployeeContractsService = EmployeeContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_contracts_repository_1.EmployeeContractsRepository,
        minio_client_service_1.MinioClientService])
], EmployeeContractsService);
//# sourceMappingURL=employee-contracts.service.js.map