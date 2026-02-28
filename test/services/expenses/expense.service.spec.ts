import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseService } from 'src/services/expenses/expense.service';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repo: jest.Mocked<ExpenseRepository>;

  const mockRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByIdOrThrow: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: ExpenseRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(ExpenseService);
    repo = module.get(ExpenseRepository);

    jest.clearAllMocks();
  });

  it('create should convert expenseDate to Date before repo.create', async () => {
    repo.create.mockResolvedValue({ id: 'e1' } as any);

    const dto: any = { description: 'X', amount: 10, expenseDate: '2024-01-02' };
    await service.create(dto);

    expect(repo.create).toHaveBeenCalledTimes(1);
    const arg = repo.create.mock.calls[0][0] as any;
    expect(arg.description).toBe('X');
    expect(arg.amount).toBe(10);
    expect(arg.expenseDate).toBeInstanceOf(Date);
    expect(arg.expenseDate.toISOString().slice(0, 10)).toBe('2024-01-02');
  });

  it('list should call repo.findAll', async () => {
    repo.findAll.mockResolvedValue([{ id: 'e1' }] as any);

    const res = await service.list();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('findOne should call repo.findByIdOrThrow(id)', async () => {
    repo.findByIdOrThrow.mockResolvedValue({ id: 'e1' } as any);

    const res = await service.findOne('e1');

    expect(repo.findByIdOrThrow).toHaveBeenCalledWith('e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should convert expenseDate to Date before repo.update', async () => {
    repo.update.mockResolvedValue({ id: 'e1' } as any);

    const dto: any = { description: 'Y', amount: 20, expenseDate: '2024-02-03' };
    await service.update('e1', dto);

    expect(repo.update).toHaveBeenCalledTimes(1);
    const [, arg] = repo.update.mock.calls[0] as any[];
    expect(arg.expenseDate).toBeInstanceOf(Date);
    expect(arg.expenseDate.toISOString().slice(0, 10)).toBe('2024-02-03');
  });

  it('remove should call repo.softDelete(id)', async () => {
    repo.softDelete.mockResolvedValue({ ok: true } as any);

    const res = await service.remove('e1');

    expect(repo.softDelete).toHaveBeenCalledWith('e1');
    expect(res).toEqual({ ok: true });
  });
});