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
exports.InterestCalculatorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class InterestCalculatorDto {
    principal;
    dueDate;
    referenceDate;
    fineRate;
    monthlyInterestRate;
}
exports.InterestCalculatorDto = InterestCalculatorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original amount (principal) to be paid.',
        example: 1000,
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], InterestCalculatorDto.prototype, "principal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date (YYYY-MM-DD).',
        example: '2026-02-10',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InterestCalculatorDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reference payment date (YYYY-MM-DD).',
        example: '2026-02-18',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InterestCalculatorDto.prototype, "referenceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fine rate (as a fraction). Default: 0.02 (2%).',
        example: 0.02,
        minimum: 0,
        maximum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], InterestCalculatorDto.prototype, "fineRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Monthly interest rate (as a fraction). Default: 0.01 (1% per month), prorated by days late (monthly/30).',
        example: 0.01,
        minimum: 0,
        maximum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], InterestCalculatorDto.prototype, "monthlyInterestRate", void 0);
//# sourceMappingURL=interest-calculator.dto.js.map