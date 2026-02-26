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
exports.EmployeeBenefitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class EmployeeBenefitDto {
    type;
    referenceYear;
    value;
}
exports.EmployeeBenefitDto = EmployeeBenefitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of benefit', enum: client_1.BenefitType, example: client_1.BenefitType.THIRTEENTH }),
    (0, class_validator_1.IsEnum)(client_1.BenefitType),
    __metadata("design:type", String)
], EmployeeBenefitDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference year for the benefit', example: 2026 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], EmployeeBenefitDto.prototype, "referenceYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value of the benefit', example: 2500 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], EmployeeBenefitDto.prototype, "value", void 0);
//# sourceMappingURL=employeeBenefit.dto.js.map