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
exports.CreateChargePaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class CreateChargePaymentDto {
    amountPaid;
    paymentDate;
    method;
    fineRate;
    monthlyInterestRate;
}
exports.CreateChargePaymentDto = CreateChargePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Paid amount', example: 1000, minimum: 0.01 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateChargePaymentDto.prototype, "amountPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date (YYYY-MM-DD)', example: '2026-02-18' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateChargePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method', enum: client_1.PaymentMethod, example: client_1.PaymentMethod.PIX }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateChargePaymentDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fine rate fraction (default 0.02)', example: 0.02, minimum: 0, maximum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateChargePaymentDto.prototype, "fineRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Monthly interest fraction (default 0.01)', example: 0.01, minimum: 0, maximum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateChargePaymentDto.prototype, "monthlyInterestRate", void 0);
//# sourceMappingURL=create-payment.dto.js.map