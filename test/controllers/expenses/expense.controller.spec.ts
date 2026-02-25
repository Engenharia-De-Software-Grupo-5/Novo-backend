import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseController } from 'src/controllers/expenses/expense.controller';
import { ExpenseService } from 'src/services/expenses/expense.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ExpenseController', () => {
  let controller: ExpenseController;
  let service: jest.Mocked<ExpenseService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [{ provide: ExpenseService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ExpenseController);
    service = module.get(ExpenseService);
  });

  it('create should call service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.create({ description: 'x' } as any);

    expect(service.create).toHaveBeenCalledWith({ description: 'x' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('list should call service.list()', async () => {
    service.list.mockResolvedValue([{ id: 'e1' }] as any);

    const res = await controller.list();

    expect(service.list).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('findOne should call service.findOne(id)', async () => {
    service.findOne.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.findOne('e1');

    expect(service.findOne).toHaveBeenCalledWith('e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.update('e1', { description: 'y' } as any);

    expect(service.update).toHaveBeenCalledWith('e1', { description: 'y' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('remove should call service.remove(id)', async () => {
  service.remove.mockResolvedValue({ ok: true } as any);

  const res = await controller.remove('e1');

  expect(service.remove).toHaveBeenCalledWith('e1');
  expect(res).toBeUndefined();
});
});