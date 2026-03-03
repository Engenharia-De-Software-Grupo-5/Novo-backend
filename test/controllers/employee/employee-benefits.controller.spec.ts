import { Test, TestingModule } from '@nestjs/testing';

import { EmployeeBenefitsController } from 'src/controllers/employees/employee-benefits.controller';
import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('EmployeeBenefitsController', () => {
  let controller: EmployeeBenefitsController;
  let service: jest.Mocked<EmployeeBenefitsService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeBenefitsController],
      providers: [{ provide: EmployeeBenefitsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeeBenefitsController);
    service = module.get(EmployeeBenefitsService);
  });

  it('create should call service.create(employeeId, dto)', async () => {
    service.create.mockResolvedValue({ id: 'b1' } as any);

    const res = await controller.create('e1', { type: 'VACATION' } as any);

    expect(service.create).toHaveBeenCalledWith('e1', { type: 'VACATION' });
    expect(res).toEqual({ id: 'b1' });
  });

  it('list should call service.list(employeeId)', async () => {
    service.list.mockResolvedValue([{ id: 'b1' }] as any);

    const res = await controller.list('e1');

    expect(service.list).toHaveBeenCalledWith('e1');
    expect(res).toEqual([{ id: 'b1' }]);
  });

  it('update should call service.update(benefitId, employeeId, dto)', async () => {
    service.update.mockResolvedValue({ id: 'b1' } as any);

    const dto: any = { value: 100 };
    const res = await controller.update('b1', 'e1', dto);

    expect(service.update).toHaveBeenCalledWith('b1', 'e1', dto);
    expect(res).toEqual({ id: 'b1' });
  });

  it('remove should await service.remove(benefitId, employeeId) and return void', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('b1', 'e1');

    expect(service.remove).toHaveBeenCalledWith('b1', 'e1');
    expect(res).toBeUndefined();
  });
});