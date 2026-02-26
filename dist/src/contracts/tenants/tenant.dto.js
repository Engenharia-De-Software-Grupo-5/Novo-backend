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
exports.TenantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_cpf_1 = require("class-validator-cpf");
const client_1 = require("@prisma/client");
const spouse_dto_1 = require("./spouse.dto");
const professionalInfo_dto_1 = require("./professionalInfo.dto");
const emergencyContact_dto_1 = require("./emergencyContact.dto");
const additionalResident_dto_1 = require("./additionalResident.dto");
const tenantDocument_dto_1 = require("./tenantDocument.dto");
const bankingInfo_dto_1 = require("./bankingInfo.dto");
const class_validator_1 = require("class-validator");
class TenantDto {
    cpf;
    name;
    birthDate;
    maritalStatus;
    monthlyIncome;
    email;
    primaryPhone;
    secondaryPhone;
    addressId;
    condominiumId;
    status;
    emergencyContacts;
    professionalInfo;
    bankingInfo;
    spouse;
    additionalResidents;
    documents;
}
exports.TenantDto = TenantDto;
__decorate([
    (0, class_validator_cpf_1.IsCPF)(),
    (0, swagger_1.ApiProperty)({
        description: 'Tenant CPF (numbers only)',
        example: '17508074084',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the tenant',
        example: 'Pedro Pereira',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        description: 'Tenant birth date',
        example: '1995-03-15T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TenantDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Marital status of the tenant',
        example: 'Single',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'Monthly income of the tenant',
        example: 5000,
    }),
    __metadata("design:type", Number)
], TenantDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        description: 'Tenant email address',
        example: 'pedro@email.com',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Primary phone number',
        example: '+55 83 99999-0000',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "primaryPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Secondary phone number',
        example: '+55 83 98888-0000',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "secondaryPhone", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: 'UUID reference of the Address entity',
        example: '6fe3e12a-8fb2-454e-9166-b12396cde907',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "addressId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'UUID reference of the condominium',
        example: 'cond-uuid-example',
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "condominiumId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TenantStatus),
    (0, swagger_1.ApiProperty)({
        description: 'Current tenant status',
        enum: client_1.TenantStatus,
        example: client_1.TenantStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], TenantDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => emergencyContact_dto_1.EmergencyContactDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of emergency contacts',
        type: () => emergencyContact_dto_1.EmergencyContactDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], TenantDto.prototype, "emergencyContacts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => professionalInfo_dto_1.ProfessionalInfoDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Professional information of the tenant',
        type: () => professionalInfo_dto_1.ProfessionalInfoDto,
    }),
    __metadata("design:type", professionalInfo_dto_1.ProfessionalInfoDto)
], TenantDto.prototype, "professionalInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => bankingInfo_dto_1.BankingInfoDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Banking information of the tenant',
        type: () => bankingInfo_dto_1.BankingInfoDto,
    }),
    __metadata("design:type", bankingInfo_dto_1.BankingInfoDto)
], TenantDto.prototype, "bankingInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => spouse_dto_1.SpouseDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Spouse information (if applicable)',
        type: () => spouse_dto_1.SpouseDto,
    }),
    __metadata("design:type", spouse_dto_1.SpouseDto)
], TenantDto.prototype, "spouse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => additionalResident_dto_1.AdditionalResidentDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional residents living with the tenant',
        type: () => additionalResident_dto_1.AdditionalResidentDto,
        isArray: true,
    }),
    __metadata("design:type", Array)
], TenantDto.prototype, "additionalResidents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => tenantDocument_dto_1.TenantDocumentDto),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant document references',
        type: () => tenantDocument_dto_1.TenantDocumentDto,
    }),
    __metadata("design:type", tenantDocument_dto_1.TenantDocumentDto)
], TenantDto.prototype, "documents", void 0);
//# sourceMappingURL=tenant.dto.js.map