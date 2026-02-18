import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BenefitType } from '@prisma/client';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeeBenefitsController } from 'src/controllers/employees/employee-benefits.controller';
import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';

describe('EmployeeBenefitsController', () => {
  let controller: EmployeeBenefitsController;
  let service: jest.Mocked<EmployeeBenefitsService>;

  const mockService = (): jest.Mocked<EmployeeBenefitsService> =>
    ({
      create: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeBenefitsController],
      providers: [{ provide: EmployeeBenefitsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeeBenefitsController);
    service = module.get(EmployeeBenefitsService);
  });

  it('should create benefit and call service', async () => {
    const employeeId = 'emp-1';
    const dto = {
      type: BenefitType.VACATION,
      referenceYear: 2026,
      value: 2500,
    };

    const created = { id: 'ben-1', ...dto };
    service.create.mockResolvedValue(created as any);

    const result = await controller.create(employeeId, dto as any);

    expect(service.create).toHaveBeenCalledWith(employeeId, dto);
    expect(result).toEqual(created);
  });

  it('should list benefits and call service', async () => {
    const employeeId = 'emp-1';
    const list = [
      {
        id: 'ben-1',
        type: BenefitType.THIRTEENTH,
        referenceYear: 2026,
        value: 1200,
      },
    ];

    service.list.mockResolvedValue(list as any);

    const result = await controller.list(employeeId);

    expect(service.list).toHaveBeenCalledWith(employeeId);
    expect(result).toEqual(list);
  });

  it('should update benefit and call service with employeeId and id', async () => {
    const employeeId = 'emp-1';
    const id = 'ben-1';
    const dto = {
      type: BenefitType.VACATION,
      referenceYear: 2026,
      value: 3000,
    };

    const updated = { id, ...dto };
    service.update.mockResolvedValue(updated as any);

    const result = await controller.update(employeeId, id, dto as any);

    expect(service.update).toHaveBeenCalledWith(employeeId, id, dto);
    expect(result).toEqual(updated);
  });

  it('should remove benefit and call service with employeeId and id (no content)', async () => {
    const employeeId = 'emp-1';
    const id = 'ben-1';

    service.remove.mockResolvedValue({ message: 'Registro removido com sucesso.' } as any);

    const result = await controller.remove(employeeId, id);

    expect(service.remove).toHaveBeenCalledWith(employeeId, id);
    expect(result).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('Funcionário não encontrado.'));
    await expect(controller.list('emp-x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should propagate BadRequestException', async () => {
    service.create.mockRejectedValue(new BadRequestException('Valor inválido.'));
    await expect(controller.create('emp-1', {} as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});