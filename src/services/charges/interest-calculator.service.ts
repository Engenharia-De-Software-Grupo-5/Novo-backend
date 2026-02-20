import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InterestCalculatorDto,
} from 'src/contracts/charges/interest-calculator.dto';
import { InterestCalculatorResponse } from 'src/contracts/charges/interest-calculator.response';

@Injectable()
export class InterestCalculatorService {
  private round2(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  private diffDays(due: Date, reference: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = reference.getTime() - due.getTime();
    if (diff <= 0) return 0;

    return Math.floor(diff / msPerDay);
  }

  calculate(dto: InterestCalculatorDto): InterestCalculatorResponse {
    const principal = Number(dto.principal);
    const fineRate = dto.fineRate ?? 0.02; // 2%
    const monthlyInterestRate = dto.monthlyInterestRate ?? 0.01; // 1% ao mês

    const due = new Date(dto.dueDate);
    const reference = new Date(dto.referenceDate);

    if (Number.isNaN(due.getTime()) || Number.isNaN(reference.getTime())) {
      throw new BadRequestException('Invalid date(s).');
    }

    const daysLate = this.diffDays(due, reference);

    const fineValue = daysLate > 0 ? this.round2(principal * fineRate) : 0;

    const dailyInterestRate = monthlyInterestRate / 30;
    const interestValue =
      daysLate > 0 ? this.round2(principal * dailyInterestRate * daysLate) : 0;

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
}