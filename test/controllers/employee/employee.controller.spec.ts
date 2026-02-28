import { Test, TestingModule } from '@nestjs/testing';

import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeService } from 'src/services/employees/employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: jest.Mocked<EmployeeService>;

  const mockService = {
    getAll: jest.fn(),
    getByCpf: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateByCpf: jest.fn(),
    delete: jest.fn(),
    deleteByCpf: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: mockService }],
    }).compile();

    controller = module.get(EmployeeController);
    service = module.get(EmployeeService);
  });

  it('getAll should call employeeService.getAll()', async () => {
    service.getAll.mockResolvedValue([{ id: 'e1' }] as any);

    const res = await controller.getAll();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('getByCpf should call employeeService.getByCpf(cpf)', async () => {
    service.getByCpf.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.getByCpf('123');

    expect(service.getByCpf).toHaveBeenCalledWith('123');
    expect(res).toEqual({ id: 'e1' });
  });

  it('getById should call employeeService.getById(employeeId)', async () => {
    service.getById.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.getById('e1');

    expect(service.getById).toHaveBeenCalledWith('e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('create should call employeeService.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.create({ name: 'A' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'A' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call employeeService.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.update('e1', { name: 'B' } as any);

    expect(service.update).toHaveBeenCalledWith('e1', { name: 'B' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('updateByCpf should call employeeService.updateByCpf(cpf, dto)', async () => {
    service.updateByCpf.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.updateByCpf('123', { name: 'C' } as any);

    expect(service.updateByCpf).toHaveBeenCalledWith('123', { name: 'C' });
    expect(res).toEqual({ id: 'e1' });
  });

  it('delete should call employeeService.delete(employeeId)', async () => {
    service.delete.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.delete('e1');

    expect(service.delete).toHaveBeenCalledWith('e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('deleteByCpf should call employeeService.deleteByCpf(cpf)', async () => {
    service.deleteByCpf.mockResolvedValue({ id: 'e1' } as any);

    const res = await controller.deleteByCpf('123');

    expect(service.deleteByCpf).toHaveBeenCalledWith('123');
    expect(res).toEqual({ id: 'e1' });
  });
});