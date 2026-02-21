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
exports.ProfessionalInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProfessionalInfoDto {
    companyName;
    companyPhone;
    companyAddressId;
    position;
    monthsWorking;
}
exports.ProfessionalInfoDto = ProfessionalInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Company name where the tenant works',
        example: 'Tech Solutions LTDA',
    }),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Company phone number',
        example: '+55 83 3333-2222',
    }),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "companyPhone", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the company address',
        example: '6fe3e12a-8fb2-454e-9166-b12396cde907',
    }),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "companyAddressId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Position held by the tenant',
        example: 'Software Engineer',
    }),
    __metadata("design:type", String)
], ProfessionalInfoDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'Number of months working at the company',
        example: 24,
    }),
    __metadata("design:type", Number)
], ProfessionalInfoDto.prototype, "monthsWorking", void 0);
//# sourceMappingURL=professionalInfo.dto.js.map