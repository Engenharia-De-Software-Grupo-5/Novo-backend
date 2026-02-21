"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let InterestCalculatorService = class InterestCalculatorService {
    round2(n) {
        return Math.round((n + Number.EPSILON) * 100) / 100;
    }
    diffDays(due, reference) {
        const msPerDay = 24 * 60 * 60 * 1000;
        const diff = reference.getTime() - due.getTime();
        if (diff <= 0)
            return 0;
        return Math.floor(diff / msPerDay);
    }
    calculate(dto) {
        const principal = Number(dto.principal);
        const fineRate = dto.fineRate ?? 0.02;
        const monthlyInterestRate = dto.monthlyInterestRate ?? 0.01;
        const due = new Date(dto.dueDate);
        const reference = new Date(dto.referenceDate);
        if (Number.isNaN(due.getTime()) || Number.isNaN(reference.getTime())) {
            throw new common_1.BadRequestException('Invalid date(s).');
        }
        const daysLate = this.diffDays(due, reference);
        const fineValue = daysLate > 0 ? this.round2(principal * fineRate) : 0;
        const dailyInterestRate = monthlyInterestRate / 30;
        const interestValue = daysLate > 0 ? this.round2(principal * dailyInterestRate * daysLate) : 0;
        const totalUpdated = this.round2(principal + fineValue + interestValue);
        return {
            principal: this.round2(principal),
            dueDate: dto.dueDate,
            referenceDate: dto.referenceDate,
            daysLate,
            fineRate,
            monthlyInterestRate,
            fineValue,
            interestValue,
            totalUpdated,
        };
    }
};
exports.InterestCalculatorService = InterestCalculatorService;
exports.InterestCalculatorService = InterestCalculatorService = __decorate([
    (0, common_1.Injectable)()
], InterestCalculatorService);
//# sourceMappingURL=interest-calculator.service.js.map