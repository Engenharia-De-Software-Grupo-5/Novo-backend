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
exports.EmployeePaymentResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class EmployeePaymentResponse {
    id;
    value;
    paymentDate;
    type;
}
exports.EmployeePaymentResponse = EmployeePaymentResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee payment ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], EmployeePaymentResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment value', example: 2500, minimum: 0.01 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], EmployeePaymentResponse.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date', example: '2026-02-18' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EmployeePaymentResponse.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment type', enum: client_1.PaymentType, example: client_1.PaymentType.SALARY }),
    (0, class_validator_1.IsEnum)(client_1.PaymentType),
    __metadata("design:type", String)
], EmployeePaymentResponse.prototype, "type", void 0);
//# sourceMappingURL=employeePayment.response.js.map