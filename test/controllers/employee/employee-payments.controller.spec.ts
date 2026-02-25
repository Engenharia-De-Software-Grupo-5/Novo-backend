import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { EmployeePaymentsController } from 'src/controllers/employees/employee-payments.controller';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';

describe('EmployeePaymentsController', () => {
  let controller: EmployeePaymentsController;
  let service: jest.Mocked<EmployeePaymentsService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeePaymentsController],
      providers: [{ provide: EmployeePaymentsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeePaymentsController);
    service = module.get(EmployeePaymentsService);
  });

  it('create should call service.create(employeeId, dto)', async () => {
    service.create.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { amount: 100, paymentDate: '2026-02-18' };

    const res = await controller.create('e1', dto);

    expect(service.create).toHaveBeenCalledWith('e1', dto);
    expect(res).toEqual({ id: 'p1' });
  });

  it('list should call service.list(employeeId)', async () => {
    service.list.mockResolvedValue([{ id: 'p1' }] as any);

    const res = await controller.list('e1');

    expect(service.list).toHaveBeenCalledWith('e1');
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('delete should call service.delete(employeeId, paymentId)', async () => {
    service.delete.mockResolvedValue({ ok: true } as any);

    const res = await controller.delete('e1', 'p1');

    expect(service.delete).toHaveBeenCalledWith('e1', 'p1');
    expect(res).toEqual({ ok: true });
  });
});