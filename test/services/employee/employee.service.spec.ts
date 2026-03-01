import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { EmployeeService } from 'src/services/employees/employee.service';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: jest.Mocked<EmployeeRepository>;

  const mockRepo: jest.Mocked<EmployeeRepository> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCpf: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateByCpf: jest.fn(),
    delete: jest.fn(),
    deleteByCpf: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: EmployeeRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(EmployeeService);
    repo = module.get(EmployeeRepository);

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return employees', async () => {
      const employees = [{ id: '1', cpf: '123' }] as any;
      repo.getAll.mockResolvedValue(employees);

      const result = await service.getAll();

      expect(repo.getAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(employees);
    });
  });

  describe('getById', () => {
    it('should return employee by id', async () => {
      const employee = { id: '1', cpf: '123' } as any;
      repo.getById.mockResolvedValue(employee);

      const result = await service.getById('1');

      expect(repo.getById).toHaveBeenCalledTimes(1);
      expect(repo.getById).toHaveBeenCalledWith('1');
      expect(result).toBe(employee);
    });
  });

  describe('getByCpf', () => {
    it('should return employee by cpf', async () => {
      const employee = { id: '1', cpf: '123' } as any;
      repo.getByCpf.mockResolvedValue(employee);

      const result = await service.getByCpf('123');

      expect(repo.getByCpf).toHaveBeenCalledTimes(1);
      expect(repo.getByCpf).toHaveBeenCalledWith('123');
      expect(result).toBe(employee);
    });
  });

  describe('create', () => {
    it('should create employee when cpf does not exist', async () => {
      const dto = { cpf: '123', name: 'A' } as any;
      repo.getByCpf.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: '1', ...dto } as any);

      const result = await service.create(dto);

      expect(repo.getByCpf).toHaveBeenCalledTimes(1);
      expect(repo.getByCpf).toHaveBeenCalledWith('123');

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith(dto);

      expect(result).toEqual({ id: '1', ...dto });
    });

    it('should throw BadRequestException when cpf already exists', async () => {
      const dto = { cpf: '123', name: 'A' } as any;
      repo.getByCpf.mockResolvedValue({ id: 'existing', cpf: '123' } as any);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);

      expect(repo.getByCpf).toHaveBeenCalledTimes(1);
      expect(repo.getByCpf).toHaveBeenCalledWith('123');

      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update employee by id', async () => {
      const dto = { cpf: '123', name: 'Novo' } as any;
      const updated = { id: '1', ...dto } as any;
      repo.update.mockResolvedValue(updated);

      const result = await service.update('1', dto);

      expect(repo.update).toHaveBeenCalledTimes(1);
      expect(repo.update).toHaveBeenCalledWith('1', dto);
      expect(result).toBe(updated);
    });
  });

  describe('updateByCpf', () => {
    it('should update employee by cpf', async () => {
      const dto = { cpf: '123', name: 'Novo' } as any;
      const updated = { id: '1', ...dto } as any;
      repo.updateByCpf.mockResolvedValue(updated);

      const result = await service.updateByCpf('123', dto);

      expect(repo.updateByCpf).toHaveBeenCalledTimes(1);
      expect(repo.updateByCpf).toHaveBeenCalledWith('123', dto);
      expect(result).toBe(updated);
    });
  });

  describe('delete', () => {
    it('should delete employee by id', async () => {
      const deleted = { id: '1', cpf: '123' } as any;
      repo.delete.mockResolvedValue(deleted);

      const result = await service.delete('1');

      expect(repo.delete).toHaveBeenCalledTimes(1);
      expect(repo.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(deleted);
    });
  });

  describe('deleteByCpf', () => {
    it('should delete employee by cpf', async () => {
      const deleted = { id: '1', cpf: '123' } as any;
      repo.deleteByCpf.mockResolvedValue(deleted);

      const result = await service.deleteByCpf('123');

      expect(repo.deleteByCpf).toHaveBeenCalledTimes(1);
      expect(repo.deleteByCpf).toHaveBeenCalledWith('123');
      expect(result).toBe(deleted);
    });
  });
});