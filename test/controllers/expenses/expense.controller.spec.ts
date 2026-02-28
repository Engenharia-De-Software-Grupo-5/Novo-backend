import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseController } from 'src/controllers/condominiums/expense.controller';
import { ExpenseService } from 'src/services/expenses/expense.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

describe('ExpenseController', () => {
  let controller: ExpenseController;
  let service: jest.Mocked<ExpenseService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    listPaginated: jest.fn(),
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
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ExpenseController);
    service = module.get(ExpenseService);
  });

  it('create should call service.create(dto, condominiumId)', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.create('c1', { description: 'x' } as any);

    expect(service.create).toHaveBeenCalledWith({ description: 'x' }, 'c1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('list should call service.list()', async () => {
    service.list.mockResolvedValue([{ id: 'e1' }] as any);

    const res = await controller.list();

    expect(service.list).toHaveBeenCalled();
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

  it('remove should call service.remove(id) and return void', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('e1');

    expect(service.remove).toHaveBeenCalledWith('e1');
    expect(res).toBeUndefined();
  });
});