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
exports.ContractResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const property_response_1 = require("../condominiums/property.response");
const tenant_response_1 = require("../tenants/tenant.response");
const contract_template_response_1 = require("../contract.templates/contract.template.response");
class ContractResponse {
    id;
    tenant;
    description;
    property;
    contractTemplate;
    contractUrl;
}
exports.ContractResponse = ContractResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'unique contract identifier',
        example: '123',
    }),
    __metadata("design:type", String)
], ContractResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant object who detains a property',
        type: () => tenant_response_1.TenantResponse,
    }),
    __metadata("design:type", tenant_response_1.TenantResponse)
], ContractResponse.prototype, "tenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'additional description about this contract',
        example: 'Sample content',
    }),
    __metadata("design:type", String)
], ContractResponse.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'property associated with this contract',
        type: () => property_response_1.PropertyResponse,
    }),
    __metadata("design:type", property_response_1.PropertyResponse)
], ContractResponse.prototype, "property", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Template associated with this contract',
        type: () => contract_template_response_1.ContractTemplateResponse,
    }),
    __metadata("design:type", contract_template_response_1.ContractTemplateResponse)
], ContractResponse.prototype, "contractTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contract URL',
        example: 'https://.../.../...',
    }),
    __metadata("design:type", String)
], ContractResponse.prototype, "contractUrl", void 0);
//# sourceMappingURL=contract.response.js.map