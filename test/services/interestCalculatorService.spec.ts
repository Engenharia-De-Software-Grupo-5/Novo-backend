import { BadRequestException } from '@nestjs/common';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';

describe('InterestCalculatorService', () => {
  let service: InterestCalculatorService;

  beforeEach(() => {
    service = new InterestCalculatorService();
  });

  it('should calculate with defaults (2% fine, 1% monthly interest prorated)', () => {
    // due 2026-02-10 -> reference 2026-02-18 => 8 days
    const res = service.calculate({
      principal: 1000,
      dueDate: '2026-02-10',
      referenceDate: '2026-02-18',
    } as any);

    expect(res.daysLate).toBe(8);
    expect(res.fineRate).toBe(0.02);
    expect(res.monthlyInterestRate).toBe(0.01);
    expect(res.fineValue).toBe(20);
    // 1000 * (0.01/30) * 8 = 2.666..., rounded to 2 decimals
    expect(res.interestValue).toBe(2.67);
    expect(res.totalUpdated).toBe(1022.67);
  });

  it('should return zero fine/interest when not late', () => {
    const res = service.calculate({
      principal: 1000,
      dueDate: '2026-02-18',
      referenceDate: '2026-02-18',
    } as any);

    expect(res.daysLate).toBe(0);
    expect(res.fineValue).toBe(0);
    expect(res.interestValue).toBe(0);
    expect(res.totalUpdated).toBe(1000);
  });

  it('should allow custom rates', () => {
    const res = service.calculate({
      principal: 100,
      dueDate: '2026-02-10',
      referenceDate: '2026-02-12', // 2 days
      fineRate: 0.1,
      monthlyInterestRate: 0.3,
    } as any);

    expect(res.daysLate).toBe(2);
    expect(res.fineValue).toBe(10);
    // 100 * (0.3/30) * 2 = 2
    expect(res.interestValue).toBe(2);
    expect(res.totalUpdated).toBe(112);
  });

  it('should throw BadRequest on invalid dates', () => {
    expect(() =>
      service.calculate({
        principal: 100,
        dueDate: 'invalid',
        referenceDate: '2026-02-12',
      } as any),
    ).toThrow(BadRequestException);
  });
});