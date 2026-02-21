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
exports.ExpenseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class ExpenseDto {
    targetType;
    condominiumId;
    propertyId;
    expenseType;
    value;
    expenseDate;
    paymentMethod;
}
exports.ExpenseDto = ExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense target type', enum: client_1.ExpenseTargetType, example: client_1.ExpenseTargetType.CONDOMINIUM }),
    (0, class_validator_1.IsEnum)(client_1.ExpenseTargetType),
    __metadata("design:type", String)
], ExpenseDto.prototype, "targetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condominium id when targetType=CONDOMINIUM', example: '123e4567-e89b-12d3-a456-426614174000', required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "condominiumId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Property id when targetType=PROPERTY', example: '123e4567-e89b-12d3-a456-426614174001', required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "propertyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense type', example: 'WATER' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "expenseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense value', example: 199.9, minimum: 0.01 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ExpenseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense date', example: '2026-02-18' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "expenseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method', enum: client_1.ExpensePaymentMethod, example: client_1.ExpensePaymentMethod.PIX }),
    (0, class_validator_1.IsEnum)(client_1.ExpensePaymentMethod),
    __metadata("design:type", String)
], ExpenseDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=expense.dto.js.map