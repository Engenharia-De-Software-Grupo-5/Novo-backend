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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const tenant_repository_1 = require("../../repositories/tenants/tenant.repository");
let TenantService = class TenantService {
    tenantRepository;
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    getAll() {
        return this.tenantRepository.getAll();
    }
    getPaginated(data) {
        return this.tenantRepository.getPaginated(data);
    }
    async getByCpf(cpf) {
        const tenant = await this.tenantRepository.getByCpf(cpf);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async getById(tenantId) {
        const tenant = await this.tenantRepository.getById(tenantId);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async create(dto) {
        const tenantExistente = await this.tenantRepository.getByCpf(dto.cpf);
        if (!!tenantExistente) {
            throw new common_1.BadRequestException('This tenant CPF already exists in the database.');
        }
        return this.tenantRepository.create(dto);
    }
    async update(id, dto) {
        const tenant = await this.tenantRepository.getById(id);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return this.tenantRepository.update(id, dto);
    }
    async deleteByCpf(cpf) {
        const tenant = await this.tenantRepository.getByCpf(cpf);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return this.tenantRepository.deleteByCpf(cpf);
    }
    async deleteById(tenantId) {
        const tenant = await this.tenantRepository.getById(tenantId);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return this.tenantRepository.deleteById(tenantId);
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_repository_1.TenantRepository])
], TenantService);
//# sourceMappingURL=tenant.service.js.map