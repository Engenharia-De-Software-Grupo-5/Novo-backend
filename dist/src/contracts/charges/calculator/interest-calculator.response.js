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
exports.InterestCalculatorResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class InterestCalculatorResponse {
    principal;
    dueDate;
    referenceDate;
    daysLate;
    fineRate;
    monthlyInterestRate;
    fineValue;
    interestValue;
    totalUpdated;
}
exports.InterestCalculatorResponse = InterestCalculatorResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "principal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-10' }),
    __metadata("design:type", String)
], InterestCalculatorResponse.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-18' }),
    __metadata("design:type", String)
], InterestCalculatorResponse.prototype, "referenceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Days late (0 if referenceDate <= dueDate).', example: 8 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "daysLate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applied fine rate (fraction).', example: 0.02 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "fineRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applied monthly interest rate (fraction).', example: 0.01 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "monthlyInterestRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fine value (rounded to 2 decimals).', example: 20 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "fineValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Interest value (rounded to 2 decimals).', example: 2.67 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "interestValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total updated value (rounded to 2 decimals).', example: 1022.67 }),
    __metadata("design:type", Number)
], InterestCalculatorResponse.prototype, "totalUpdated", void 0);
//# sourceMappingURL=interest-calculator.response.js.map