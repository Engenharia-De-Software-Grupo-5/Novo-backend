import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeService } from 'src/services/employees/employee.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockEmployee = {
    id: 'uuid-1',
    cpf: '12345678901',
    name: 'João',
    role: 'Dev',
    contractType: 'CLT',
    hireDate: new Date(),
    baseSalary: 1000,
    workload: 40,
    status: 'ACTIVE',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: mockService }],
    }).compile();

    controller = module.get(EmployeeController);
  });

  afterEach(() => jest.clearAllMocks());

  it('getAll → returns list', async () => {
    mockService.getAll.mockResolvedValue([mockEmployee]);

    const result = await controller.getAll();

    expect(result).toHaveLength(1);
    expect(mockService.getAll).toHaveBeenCalled();
  });

  it('getById → returns employee', async () => {
    mockService.getById.mockResolvedValue(mockEmployee);

    const result = await controller.getById('uuid-1');

    expect(result.id).toBe('uuid-1');
  });

  it('getById → propagates NotFound', async () => {
    mockService.getById.mockRejectedValue(new NotFoundException());

    await expect(controller.getById('404'))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('create → create employee', async () => {
    mockService.create.mockResolvedValue(mockEmployee);

    const result = await controller.create(mockEmployee as any);

    expect(result.id).toBeDefined();
    expect(mockService.create).toHaveBeenCalledWith(mockEmployee);
  });

  it('create → propagates BadRequest', async () => {
    mockService.create.mockRejectedValue(new BadRequestException());

    await expect(controller.create(mockEmployee as any))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('update → calls the service', async () => {
    mockService.update.mockResolvedValue(mockEmployee);

    const result = await controller.update('uuid-1', mockEmployee as any);

    expect(result.id).toBe('uuid-1');
    expect(mockService.update).toHaveBeenCalledWith('uuid-1', mockEmployee);
  });

  it('delete → removes employee', async () => {
    mockService.delete.mockResolvedValue(mockEmployee);

    const result = await controller.delete('uuid-1');

    expect(result.id).toBe('uuid-1');
    expect(mockService.delete).toHaveBeenCalledWith('uuid-1');
  });
});
