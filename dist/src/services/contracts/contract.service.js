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
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const contract_repository_1 = require("../../repositories/contracts/contract.repository");
const minio_client_service_1 = require("../tools/minio-client.service");
const generate_contract_service_1 = require("../tools/generate-contract.service");
let ContractService = class ContractService {
    minioService;
    generateContract;
    repo;
    allowedExtensions = ['pdf'];
    constructor(minioService, generateContract, repo) {
        this.minioService = minioService;
        this.generateContract = generateContract;
        this.repo = repo;
    }
    getAll() {
        return this.repo.getAll();
    }
    listPaginated(data) {
        return this.repo.getPaginated(data);
    }
    async getById(contratoId) {
        const result = await this.repo.getById(contratoId);
        const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
        result.contractUrl = tempUrl;
        return result;
    }
    async create(dto, file) {
        const contratoExistente = await this.repo.checkIfHas(dto);
        if (contratoExistente) {
            throw new common_1.BadRequestException('This contract already exists');
        }
        if (dto.contractTemplateId) {
            const response = await this.repo.create(dto);
            const urlPromise = await this.generateContract.execute(response.id, dto.content);
            const result = await this.repo.updateUrl(response.id, urlPromise.url);
            const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
            result.contractUrl = tempUrl;
            return result;
        }
        else {
            const response = await this.repo.create(dto);
            const minioResponse = await this.minioService.uploadFile(file, ['pdf'], response.id + '_' + new Date().getTime() + '.pdf');
            const result = await this.repo.updateUrl(response.id, minioResponse.fileName);
            const tempUrl = await this.minioService.getFileUrl(result.contractUrl);
            result.contractUrl = tempUrl;
            return result;
        }
    }
    update(id, dto) {
        return this.repo.update(id, dto);
    }
    delete(contratoId) {
        return this.repo.delete(contratoId);
    }
    listByTenant(tenantId) {
        return this.repo.listByTenant(tenantId);
    }
    listByProperty(propertyId) {
        return this.repo.listByProperty(propertyId);
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [minio_client_service_1.MinioClientService,
        generate_contract_service_1.GenerateContractService,
        contract_repository_1.ContractRepository])
], ContractService);
//# sourceMappingURL=contract.service.js.map