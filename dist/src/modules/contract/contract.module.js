"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModule = void 0;
const common_1 = require("@nestjs/common");
const contract_service_1 = require("../../services/contracts/contract.service");
const contract_repository_1 = require("../../repositories/contracts/contract.repository");
const contract_controller_1 = require("../../controllers/contracts/contract.controller");
const minio_client_module_1 = require("../tools/minio-client.module");
const generate_contract_service_1 = require("../../services/tools/generate-contract.service");
const template_engine_service_1 = require("../../services/tools/template-engine.service");
const pdf_generator_service_1 = require("../../services/tools/pdf-generator.service");
const preview_contract_service_1 = require("../../services/contracts/preview.contract.service");
const contract_template_repository_1 = require("../../repositories/contract.templates/contract.template.repository");
let ContractModule = class ContractModule {
};
exports.ContractModule = ContractModule;
exports.ContractModule = ContractModule = __decorate([
    (0, common_1.Module)({
        imports: [minio_client_module_1.MinioClientModule],
        controllers: [contract_controller_1.ContractController],
        providers: [contract_service_1.ContractService, contract_repository_1.ContractRepository, generate_contract_service_1.GenerateContractService, template_engine_service_1.TemplateEngineService, pdf_generator_service_1.PdfGeneratorService, preview_contract_service_1.PreviewContractService, contract_template_repository_1.ContractTemplateRepository],
    })
], ContractModule);
//# sourceMappingURL=contract.module.js.map