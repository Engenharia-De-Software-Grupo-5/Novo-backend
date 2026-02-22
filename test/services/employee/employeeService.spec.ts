import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from 'src/services/employees/employee.service';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { BadRequestException} from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCpf: jest.fn(),
    updateByCpf: jest.fn(),
    deleteByCpf: jest.fn(),
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
      providers: [
        EmployeeService,
        { provide: EmployeeRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(EmployeeService);
  });

  afterEach(() => jest.clearAllMocks());

  it('getAll → returns list of employees', async () => {
    mockRepository.getAll.mockResolvedValue([mockEmployee]);

    const result = await service.getAll();

    expect(result).toHaveLength(1);
    expect(mockRepository.getAll).toHaveBeenCalled();
  });

  it('getById → employee exists', async () => {
    mockRepository.getById.mockResolvedValue(mockEmployee);

    const result = await service.getById('uuid-1');

    expect(result.id).toBe('uuid-1');
  });

  it('getByCpf → employee exists', async () => {
    mockRepository.getByCpf.mockResolvedValue(mockEmployee);

    const result = await service.getByCpf('12345678901');

    expect(result.cpf).toBe('12345678901');
  });

  it("getById → employee doesn't exist", async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(service.getById('404')).resolves.toBeNull();
  });

  it("getByCpf → employee doesn't exist", async () => {
    mockRepository.getByCpf.mockResolvedValue(null);

    await expect(service.getByCpf('404')).resolves.toBeNull();
  });

  it('create → new CPF', async () => {
    mockRepository.getByCpf.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockEmployee);

    const result = await service.create(mockEmployee as any);

    expect(result.id).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('create → duplicated CPF', async () => {
    mockRepository.getByCpf.mockResolvedValue(mockEmployee);

    await expect(service.create(mockEmployee as any))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('update → updates  employee', async () => {
    mockRepository.update.mockResolvedValue(mockEmployee);

    const result = await service.update('uuid-1', mockEmployee as any);

    expect(result.id).toBe('uuid-1');
    expect(mockRepository.update).toHaveBeenCalledWith('uuid-1', mockEmployee);
  });

  it('updateByCpf → updates  employee', async () => {
    mockRepository.updateByCpf.mockResolvedValue(mockEmployee);

    const result = await service.updateByCpf('12345678901', mockEmployee as any);

    expect(result.cpf).toBe('12345678901');
    expect(mockRepository.updateByCpf).toHaveBeenCalledWith('12345678901', mockEmployee);
  });

  it("update → employee doesn't exist", async () => {
    mockRepository.update.mockResolvedValue(null);

    await expect(service.update('404', mockEmployee as any))
      .resolves.toBeNull();
  });

  it("updateByCpf → employee doesn't exist", async () => {
    mockRepository.updateByCpf.mockResolvedValue(null);

    await expect(service.updateByCpf('404', mockEmployee as any))
      .resolves.toBeNull();
  });

  it('delete → removes employee', async () => {
    mockRepository.delete.mockResolvedValue(mockEmployee);

    const result = await service.delete('uuid-1');

    expect(result.id).toBe('uuid-1');
  });

  it('deleteByCpf → removes employee', async () => {
    mockRepository.deleteByCpf.mockResolvedValue(mockEmployee);

    const result = await service.deleteByCpf('12345678901');

    expect(result.cpf).toBe('12345678901');
  });

  it("delete → employee doesn't exist", async () => {
    mockRepository.delete.mockResolvedValue(null);

    await expect(service.delete('404')).resolves.toBeNull();
  });

it("deleteByCpf → employee doesn't exist", async () => {
    mockRepository.deleteByCpf.mockResolvedValue(null);

    await expect(service.deleteByCpf('404')).resolves.toBeNull();
  });
});
