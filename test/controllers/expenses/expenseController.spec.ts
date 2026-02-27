import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';

import { ExpenseController } from 'src/controllers/condominiums/expense.controller';
import { ExpenseService } from 'src/services/expenses/expense.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ExpenseController', () => {
  let controller: ExpenseController;
  let service: jest.Mocked<ExpenseService>;

  const mockService = () =>
    ({
      create: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [{ provide: ExpenseService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ExpenseController);
    service = module.get(ExpenseService);
  });

  it('should create expense', async () => {
    service.create.mockResolvedValue({ id: 'exp-1' } as any);

    const dto = {
      targetType: ExpenseTargetType.CONDOMINIUM,
      condominiumId: 'cond-1',
      expenseType: 'WATER',
      value: 100,
      expenseDate: '2026-02-18',
      paymentMethod: ExpensePaymentMethod.PIX,
    };

    const res = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 'exp-1' });
  });

  it('should list expenses', async () => {
    service.list.mockResolvedValue([{ id: 'exp-1' }] as any);
    const res = await controller.list();
    expect(service.list).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'exp-1' }]);
  });

  it('should find one', async () => {
    service.findOne.mockResolvedValue({ id: 'exp-1' } as any);
    const res = await controller.findOne('exp-1');
    expect(service.findOne).toHaveBeenCalledWith('exp-1');
    expect(res).toEqual({ id: 'exp-1' });
  });

  it('should update', async () => {
    service.update.mockResolvedValue({ id: 'exp-1' } as any);
    const dto = {} as any;

    const res = await controller.update('exp-1', dto);

    expect(service.update).toHaveBeenCalledWith('exp-1', dto);
    expect(res).toEqual({ id: 'exp-1' });
  });

  it('should remove (no content)', async () => {
    service.remove.mockResolvedValue({ message: 'ok' } as any);

    const res = await controller.remove('exp-1');

    expect(service.remove).toHaveBeenCalledWith('exp-1');
    expect(res).toBeUndefined();
  });

  it('should propagate errors', async () => {
    service.findOne.mockRejectedValue(new NotFoundException('nf'));
    await expect(controller.findOne('x')).rejects.toBeInstanceOf(NotFoundException);

    service.create.mockRejectedValue(new BadRequestException('br'));
    await expect(controller.create({} as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});