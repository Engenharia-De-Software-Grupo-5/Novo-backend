import { Test, TestingModule } from '@nestjs/testing';

import { InterestCalculatorController } from 'src/controllers/charges/interest-calculator.controller';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('InterestCalculatorController', () => {
  let controller: InterestCalculatorController;
  let service: jest.Mocked<InterestCalculatorService>;

  const mockService = {
    calculate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestCalculatorController],
      providers: [{ provide: InterestCalculatorService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(InterestCalculatorController);
    service = module.get(InterestCalculatorService);
  });

  it('calculate should call service.calculate(dto)', () => {
    service.calculate.mockReturnValue({ totalUpdated: 123 } as any);

    const dto: any = {
      principal: 100,
      dueDate: '2026-02-10',
      referenceDate: '2026-02-12',
      fineRate: 0.02,
      monthlyInterestRate: 0.01,
    };

    const res = controller.calculate(dto);

    expect(service.calculate).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ totalUpdated: 123 });
  });
});