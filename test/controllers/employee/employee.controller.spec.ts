import { Test, TestingModule } from '@nestjs/testing';

import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeService } from 'src/services/employees/employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: jest.Mocked<EmployeeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get(EmployeeService);
  });

  it('getById should call service.getById', async () => {
    service.getById.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.getById('c1', 'e1');

    expect(service.getById).toHaveBeenCalledWith('c1', 'e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('create should call service.create', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.create('c1', { name: 'A' } as any);

    expect(service.create).toHaveBeenCalledWith('c1', { name: 'A' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call service.update', async () => {
  service.update.mockResolvedValue({ id: 'e1' } as any);

  const res = await controller.update('c1', 'e1', { name: 'B' } as any);

  expect(service.update).toHaveBeenCalled();
  expect(res).toEqual({ id: 'e1' });
});

  it('delete should call service.delete and return success message', async () => {
  service.delete.mockResolvedValue({ id: 'e1' } as any);

  const res = await controller.delete('c1', 'e1');

  expect(service.delete).toHaveBeenCalledTimes(1);
  expect(service.delete).toHaveBeenCalledWith('c1', 'e1');

  expect(res).toEqual({
    message: 'Employee com id e1 deletado com sucesso.',
    });
  });
});
