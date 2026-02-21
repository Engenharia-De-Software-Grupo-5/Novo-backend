import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';



import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { PaymentType } from '@prisma/client';
import { EmployeePaymentsController } from 'src/controllers/employees/employee-payments.controller';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';

describe('EmployeePaymentsController', () => {
  let controller: EmployeePaymentsController;
  let service: jest.Mocked<EmployeePaymentsService>;

  const mockService = (): jest.Mocked<EmployeePaymentsService> =>
    ({
      create: jest.fn(),
      list: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeePaymentsController],
      providers: [{ provide: EmployeePaymentsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeePaymentsController);
    service = module.get(EmployeePaymentsService);
  });

  it('should create payment and call service', async () => {
    const employeeId = 'emp-1';
    const dto = {
      value: 2500,
      paymentDate: '2026-02-18',
      type: PaymentType.SALARY,
    };

    const created = {
      id: 'pay-1',
      ...dto,
    };

    service.create.mockResolvedValue(created as any);

    const result = await controller.create(employeeId, dto as any);

    expect(service.create).toHaveBeenCalledWith(employeeId, dto);
    expect(result).toEqual(created);
  });

  it('should list payments and call service', async () => {
    const employeeId = 'emp-1';
    const list = [
      {
        id: 'pay-1',
        value: 100,
        paymentDate: '2026-02-10',
        type: PaymentType.BONUS,
      },
    ];

    service.list.mockResolvedValue(list as any);

    const result = await controller.list(employeeId);

    expect(service.list).toHaveBeenCalledWith(employeeId);
    expect(result).toEqual(list);
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('Employee not found.'));
    await expect(controller.list('emp-x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should propagate BadRequestException', async () => {
    service.create.mockRejectedValue(new BadRequestException('Invalid payment value.'));
    await expect(controller.create('emp-1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});