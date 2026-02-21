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
exports.ProfessionalInfoResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_response_1 = require("../condominiums/address.response");
class ProfessionalInfoResponse {
    id;
    position;
    companyName;
    companyPhone;
    companyAddress;
    monthsWorking;
}
exports.ProfessionalInfoResponse = ProfessionalInfoResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Professional info unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ProfessionalInfoResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant position',
        example: 'Software Engineer',
    }),
    __metadata("design:type", String)
], ProfessionalInfoResponse.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant company name',
        example: 'Tech Solutions Ltda',
    }),
    __metadata("design:type", String)
], ProfessionalInfoResponse.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant company phone',
        example: '+5511999999999',
    }),
    __metadata("design:type", String)
], ProfessionalInfoResponse.prototype, "companyPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant company address',
        type: () => address_response_1.AddressResponse,
    }),
    __metadata("design:type", address_response_1.AddressResponse)
], ProfessionalInfoResponse.prototype, "companyAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant months working',
        example: 12,
    }),
    __metadata("design:type", Number)
], ProfessionalInfoResponse.prototype, "monthsWorking", void 0);
//# sourceMappingURL=professionalInfo.response.js.map