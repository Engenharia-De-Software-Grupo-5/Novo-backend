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
exports.ContractTemplateService = void 0;
const common_1 = require("@nestjs/common");
const contract_template_repository_1 = require("../../repositories/contract.templates/contract.template.repository");
let ContractTemplateService = class ContractTemplateService {
    contractTemplateRepository;
    constructor(contractTemplateRepository) {
        this.contractTemplateRepository = contractTemplateRepository;
    }
    getAll(name) {
        return this.contractTemplateRepository.getAll(name);
    }
    getPaginated(data) {
        return this.contractTemplateRepository.getPaginated(data);
    }
    getById(contractTemplateId) {
        return this.contractTemplateRepository.getById(contractTemplateId);
    }
    create(dto) {
        return this.contractTemplateRepository.create(dto);
    }
    update(contractTemplateId, dto) {
        return this.contractTemplateRepository.update(contractTemplateId, dto);
    }
    delete(contractTemplateId) {
        return this.contractTemplateRepository.delete(contractTemplateId);
    }
};
exports.ContractTemplateService = ContractTemplateService;
exports.ContractTemplateService = ContractTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contract_template_repository_1.ContractTemplateRepository])
], ContractTemplateService);
//# sourceMappingURL=contract.template.service.js.map