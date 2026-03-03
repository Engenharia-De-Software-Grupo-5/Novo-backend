// test/controllers/expenses/expense.controller.spec.ts
import { ExpenseController } from 'src/controllers/condominiums/expense.controller';
import { ExpenseService } from 'src/services/expenses/expense.service';

describe('ExpenseController', () => {
  let controller: ExpenseController;
  let service: jest.Mocked<ExpenseService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      getAll: jest.fn(),
      listPaginated: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new ExpenseController(service);
  });

  it('create should call service.create(dto, condominiumId)', async () => {
    const dto = { description: 'd' } as any;
    service.create.mockResolvedValue({ id: 'ex1' } as any);

    const res = await controller.create('c1', dto);

    expect(service.create).toHaveBeenCalledWith(dto, 'c1');
    expect(res).toEqual({ id: 'ex1' });
  });

  it('list should call service.getAll()', async () => {
    service.getAll.mockResolvedValue([{ id: 'ex1' }] as any);

    const res = await controller.list();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'ex1' }]);
  });

  it('getPaginated should call service.listPaginated(query)', async () => {
    const query = { page: 1, limit: 10 } as any;
    service.listPaginated.mockResolvedValue({
      items: [{ id: 'ex1' }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    } as any);

    const res = await controller.getPaginated(query);

    expect(service.listPaginated).toHaveBeenCalledWith(query);
    expect(res).toEqual({
      items: [{ id: 'ex1' }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });

  it('findOne should call service.findOne(id)', async () => {
    service.findOne.mockResolvedValue({ id: 'ex1' } as any);

    const res = await controller.findOne('ex1');

    expect(service.findOne).toHaveBeenCalledWith('ex1');
    expect(res).toEqual({ id: 'ex1' });
  });

  it('update should call service.update(id, dto)', async () => {
    const dto = { description: 'updated' } as any;
    service.update.mockResolvedValue({ id: 'ex1' } as any);

    const res = await controller.update('ex1', dto);

    expect(service.update).toHaveBeenCalledWith('ex1', dto);
    expect(res).toEqual({ id: 'ex1' });
  });

  it('remove should call service.remove(id) and return void', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('ex1');

    expect(service.remove).toHaveBeenCalledWith('ex1');
    expect(res).toBeUndefined();
  });
});