import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from 'src/services/expenses/expense.service';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repo: jest.Mocked<ExpenseRepository>;

  const mockRepo = () =>
    ({
      create: jest.fn(),
      findAll: jest.fn(),
      findByIdOrThrow: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: ExpenseRepository, useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(ExpenseService);
    repo = module.get(ExpenseRepository);
  });

  it('should create and convert expenseDate to Date', async () => {
    repo.create.mockResolvedValue({ id: 'exp-1' } as any);

    const dto = {
      targetType: ExpenseTargetType.CONDOMINIUM,
      condominiumId: 'cond-1',
      expenseType: 'WATER',
      value: 100,
      expenseDate: '2026-02-18',
      paymentMethod: ExpensePaymentMethod.PIX,
    };

    await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'cond-1',
        expenseType: 'WATER',
        value: 100,
        paymentMethod: ExpensePaymentMethod.PIX,
        expenseDate: expect.any(Date),
      }),
    );

    const calledArg = (repo.create as jest.Mock).mock.calls[0][0];
    expect(calledArg.expenseDate instanceof Date).toBe(true);
  });

  it('should list', async () => {
    repo.findAll.mockResolvedValue([{ id: 'exp-1' }] as any);
    const res = await service.list();
    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'exp-1' }]);
  });

  it('should findOne', async () => {
    repo.findByIdOrThrow.mockResolvedValue({ id: 'exp-1' } as any);
    const res = await service.findOne('exp-1');
    expect(repo.findByIdOrThrow).toHaveBeenCalledWith('exp-1');
    expect(res).toEqual({ id: 'exp-1' });
  });

  it('should update and convert expenseDate to Date', async () => {
    repo.update.mockResolvedValue({ id: 'exp-1' } as any);

    const dto = {
      targetType: ExpenseTargetType.PROPERTY,
      propertyId: 'prop-1',
      expenseType: 'REPAIR',
      value: 200,
      expenseDate: '2026-02-18',
      paymentMethod: ExpensePaymentMethod.TRANSFER,
    };

    await service.update('exp-1', dto as any);

    expect(repo.update).toHaveBeenCalledWith(
      'exp-1',
      expect.objectContaining({
        targetType: ExpenseTargetType.PROPERTY,
        propertyId: 'prop-1',
        expenseType: 'REPAIR',
        value: 200,
        paymentMethod: ExpensePaymentMethod.TRANSFER,
        expenseDate: expect.any(Date),
      }),
    );
  });

  it('should remove', async () => {
    repo.softDelete.mockResolvedValue({ message: 'ok' } as any);

    const res = await service.remove('exp-1');

    expect(repo.softDelete).toHaveBeenCalledWith('exp-1');
    expect(res).toEqual({ message: 'ok' });
  });
});