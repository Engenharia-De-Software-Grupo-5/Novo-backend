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
exports.TenantResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const emergencyContact_response_1 = require("./emergencyContact.response");
const tenantDocument_response_1 = require("./tenantDocument.response");
const professionalInfo_response_1 = require("./professionalInfo.response");
const bankingInfo_response_1 = require("./bankingInfo.response");
const spouse_response_1 = require("./spouse.response");
const additionalResident_response_1 = require("./additionalResident.response");
const address_response_1 = require("../condominiums/address.response");
class TenantResponse {
    id;
    name;
    cpf;
    maritalStatus;
    email;
    primaryPhone;
    secondaryPhone;
    birthDate;
    monthlyIncome;
    status;
    spouse;
    additionalResidents;
    professionalInfo;
    bankingInfo;
    emergencyContacts;
    documents;
    address;
    condominiumId;
}
exports.TenantResponse = TenantResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant full name',
        example: 'Maria Silva',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant CPF (numbers only)',
        example: '12345678901',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant marital status',
        example: 'Married',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant email address',
        example: 'maria.silva@example.com',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant phone number',
        example: '+5511999999999',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "primaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant secondary phone number',
        example: '+5511988888888',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "secondaryPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant birth date',
        example: '1990-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TenantResponse.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant monthly income',
        example: 5000,
    }),
    __metadata("design:type", Number)
], TenantResponse.prototype, "monthlyIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant status',
        example: 'ACTIVE',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant spouse information',
        type: () => spouse_response_1.SpouseResponse,
    }),
    __metadata("design:type", spouse_response_1.SpouseResponse)
], TenantResponse.prototype, "spouse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant additional residents',
        type: () => [additionalResident_response_1.AdditionalResidentResponse],
    }),
    __metadata("design:type", Array)
], TenantResponse.prototype, "additionalResidents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant professional information',
        type: () => professionalInfo_response_1.ProfessionalInfoResponse,
    }),
    __metadata("design:type", professionalInfo_response_1.ProfessionalInfoResponse)
], TenantResponse.prototype, "professionalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant banking information',
        type: () => bankingInfo_response_1.BankingInfoResponse,
    }),
    __metadata("design:type", bankingInfo_response_1.BankingInfoResponse)
], TenantResponse.prototype, "bankingInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant emergency contacts',
        type: () => [emergencyContact_response_1.EmergencyContactResponse],
    }),
    __metadata("design:type", Array)
], TenantResponse.prototype, "emergencyContacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant documents',
        type: () => [tenantDocument_response_1.TenantDocumentResponse],
    }),
    __metadata("design:type", tenantDocument_response_1.TenantDocumentResponse)
], TenantResponse.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant address',
        type: () => address_response_1.AddressResponse,
    }),
    __metadata("design:type", address_response_1.AddressResponse)
], TenantResponse.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant condominium ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], TenantResponse.prototype, "condominiumId", void 0);
//# sourceMappingURL=tenant.response.js.map