import { BadRequestException } from '@nestjs/common';
import { EmployeeService } from 'src/services/employees/employee.service';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: jest.Mocked<EmployeeRepository>;
  let contractsService: jest.Mocked<EmployeeContractsService>;

  beforeEach(() => {
    repo = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getPaginated: jest.fn(),
      getByCpf: jest.fn(),
    } as any;

    contractsService = {
      updateEmployeeContracts: jest.fn(),
    } as any;

    service = new EmployeeService(repo as any, contractsService as any);
  });

  it('create should throw BadRequestException when employee with cpf already exists', async () => {
    repo.getByCpf.mockResolvedValue({ id: 'e1' } as any);

    const dto = {
      cpf: '123',
      birthDate: new Date(),
      role: 'X',
      status: 'ACTIVE',
      name: 'A',
    } as any;

    await expect(service.create('c1', dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.getByCpf).toHaveBeenCalledWith('c1', '123');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('create should call repo.create when cpf does not exist', async () => {
    repo.getByCpf.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 'e1' } as any);

    const dto = {
      cpf: '123',
      birthDate: new Date(),
      role: 'X',
      status: 'ACTIVE',
      name: 'A',
    } as any;

    const res = await service.create('c1', dto);

    expect(repo.getByCpf).toHaveBeenCalledWith('c1', '123');
    expect(repo.create).toHaveBeenCalledWith('c1', dto);
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call repo.update and contractsService.updateEmployeeContracts and return merged object', async () => {
    repo.update.mockResolvedValue({
      id: 'e1',
      employeeContracts: [{ id: 'ct1' }, { id: 'ct2' }],
    } as any);

    contractsService.updateEmployeeContracts.mockResolvedValue([
      { id: 'ct1', condId: 'c1', employeeId: 'e1' },
      { id: 'ct2', condId: 'c1', employeeId: 'e1' },
    ] as any);

    const dto = { name: 'B' } as any;
    const files = [{ originalname: 'a.pdf' } as any];
    const existingIds = ['ct1', 'ct2'];

    const res = await service.update('c1', 'e1', dto, files as any, existingIds);

    expect(repo.update).toHaveBeenCalledWith('c1', 'e1', dto);
    expect(contractsService.updateEmployeeContracts).toHaveBeenCalledWith(
      'c1',
      'e1',
      files,
      existingIds,
    );

    const anyRes = res as any;
    expect(anyRes.id).toBe('e1');
    expect(anyRes.employeeContracts).toEqual([{ id: 'ct1' }, { id: 'ct2' }]);

    expect(anyRes.contracts).toHaveLength(2);
    expect(anyRes.contracts[0].id).toBe('ct1');
    expect(anyRes.contracts[1].id).toBe('ct2');
    expect(anyRes.lastContract.id).toBe('ct2');
  });

  it('delete should call repo.delete and return {id} (current behavior)', async () => {
    repo.delete.mockResolvedValue({ id: 'e1' } as any);

    const res = await service.delete('c1', 'e1');

    expect(repo.delete).toHaveBeenCalledWith('c1', 'e1');
    expect(res).toEqual({ id: 'e1' });
  });

  it('getPaginated should call repo.getPaginated and return { data: EmployeeResponse, meta }', async () => {
    repo.getPaginated.mockResolvedValue({
      items: [{ id: 'e1' }],
      meta: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
    } as any);

    const res = await service.getPaginated('c1', { page: 1, limit: 10 } as any);

    expect(repo.getPaginated).toHaveBeenCalledWith('c1', { page: 1, limit: 10 });


    expect(res).toEqual({
      data: EmployeeResponse,
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });
});