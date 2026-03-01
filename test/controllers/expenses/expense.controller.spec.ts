import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeService } from 'src/services/employees/employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: jest.Mocked<EmployeeService>;

  beforeEach(() => {
    service = {
      getPaginated: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    controller = new EmployeeController(service);
  });

  it('getPaginated should call service.getPaginated', async () => {
    service.getPaginated.mockResolvedValue({
      data: [{ id: 'e1' }],
      meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    } as any);

    const query = { page: 1, perPage: 10 } as any;

    const res = await controller.getPaginated('c1', query);

    expect(service.getPaginated).toHaveBeenCalledWith('c1', query);
    expect(res).toEqual({
      data: [{ id: 'e1' }],
      meta: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    });
  });

  it('getById should call service.getById', async () => {
    service.getById.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.getById('c1', 'e1');

    expect(service.getById).toHaveBeenCalledWith('c1', 'e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('create should call service.create', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const dto = { name: 'A' } as any;
    const res = await controller.create('c1', dto);

    expect(service.create).toHaveBeenCalledWith('c1', dto);
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should parse data JSON and call service.update (with files and existingFileIds)', async () => {
    service.update.mockResolvedValue({ id: 'e1' } as any);

    const files = [{ originalname: 'file.pdf' }] as any; // Express.Multer.File[]
    const dto = { name: 'B' } as any;
    const data = JSON.stringify(dto);
    const existingFileIds = ['ct1', 'ct2'];

    const res = await controller.update('c1', 'e1', files, data, existingFileIds);

    expect(service.update).toHaveBeenCalledWith('c1', 'e1', dto, files, existingFileIds);
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call service.update with empty dto when data is not provided', async () => {
    service.update.mockResolvedValue({ id: 'e1' } as any);

    const files = [] as any;
    const existingFileIds: string[] = [];

    const res = await controller.update('c1', 'e1', files, undefined as any, existingFileIds);

    expect(service.update).toHaveBeenCalledWith('c1', 'e1', {}, files, existingFileIds);
    expect(res).toEqual({ id: 'e1' });
  });

  it('delete should call service.delete and return message (current behavior)', async () => {
    service.delete.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.delete('c1', 'e1');

    expect(service.delete).toHaveBeenCalledWith('c1', 'e1');
    expect(res).toEqual({ message: 'Employee com id e1 deletado com sucesso.' });
  });
});