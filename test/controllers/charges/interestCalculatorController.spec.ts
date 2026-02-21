import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { InterestCalculatorController } from 'src/controllers/charges/interest-calculator.controller';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('InterestCalculatorController', () => {
  let controller: InterestCalculatorController;
  let service: jest.Mocked<InterestCalculatorService>;

  const mockService = () =>
    ({
      calculate: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestCalculatorController],
      providers: [{ provide: InterestCalculatorService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(InterestCalculatorController);
    service = module.get(InterestCalculatorService);
  });

  it('should call service.calculate and return result', () => {
    service.calculate.mockReturnValue({ totalUpdated: 123 } as any);

    const dto = {
      principal: 1000,
      dueDate: '2026-02-10',
      referenceDate: '2026-02-18',
    };

    const res = controller.calculate(dto as any);

    expect(service.calculate).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ totalUpdated: 123 });
  });

  it('should propagate errors', () => {
    service.calculate.mockImplementation(() => {
      throw new BadRequestException('bad');
    });

    expect(() => controller.calculate({} as any)).toThrow(BadRequestException);
  });
});