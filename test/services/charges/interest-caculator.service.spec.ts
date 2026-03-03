import { BadRequestException } from '@nestjs/common';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';

describe('InterestCalculatorService', () => {
  let service: InterestCalculatorService;

  beforeEach(() => {
    service = new InterestCalculatorService();
  });

  it('should return daysLate=0 and no fine/interest when reference <= due', () => {
    const res = service.calculate({
      principal: 1000,
      dueDate: '2023-02-01',
      referenceDate: '2023-02-01',
      fineRate: 0.02,
      monthlyInterestRate: 0.01,
    } as any);

    expect(res.daysLate).toBe(0);
    expect(res.fineValue).toBe(0);
    expect(res.interestValue).toBe(0);
    expect(res.totalUpdated).toBe(1000);
  });

  it('should calculate fine + interest when daysLate > 0', () => {

    const res = service.calculate({
      principal: 1000,
      dueDate: '2023-01-01',
      referenceDate: '2023-01-31',
      fineRate: 0.02, 
      monthlyInterestRate: 0.01, 
    } as any);

    expect(res.daysLate).toBeGreaterThan(0);
    expect(res.fineValue).toBe(20); 
    expect(res.interestValue).toBeGreaterThan(0);
    expect(res.totalUpdated).toBeGreaterThan(1000);
  });

  it('should use default fineRate and monthlyInterestRate when omitted', () => {
    const res = service.calculate({
      principal: 1000,
      dueDate: '2023-01-01',
      referenceDate: '2023-02-01',

    } as any);

    expect(res.fineRate).toBe(0.02);
    expect(res.monthlyInterestRate).toBe(0.01);
    expect(res.daysLate).toBeGreaterThan(0);
  });

  it('should round values to 2 decimals', () => {
    const res = service.calculate({
      principal: 999.999,
      dueDate: '2023-01-01',
      referenceDate: '2023-02-15',
    } as any);


    expect(res.principal).toBe(1000);

    expect(Number(res.totalUpdated.toFixed(2))).toBe(res.totalUpdated);
  });

  it('should throw BadRequestException on invalid dates', () => {
    expect(() =>
      service.calculate({
        principal: 1000,
        dueDate: 'invalid-date',
        referenceDate: '2023-02-01',
      } as any),
    ).toThrow(BadRequestException);
  });
});