import { EmployeeService } from 'src/services/employees/employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: any;
  let contractsService: any;

  const validEmployeeDto = {
    name: 'B',
    cpf: '12345678900',
    birthDate: new Date('2000-01-01'),
    role: 'ROLE' as any,
    status: 'ACTIVE' as any,
    contractType: 'CLT' as any,
    hireDate: new Date('2024-01-01'),
    baseSalary: 1000,
    workload: 40,
  } as any;

  beforeEach(() => {
    repo = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByCpf: jest.fn(),
    };

    contractsService = {
      updateEmployeeContracts: jest.fn(),
    };

    service = new EmployeeService(repo, contractsService);
  });

  it('create should call repo.create when cpf does not exist', async () => {
    repo.getByCpf.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 'e1' });

    const res = await service.create('c1', validEmployeeDto);

    expect(repo.getByCpf).toHaveBeenCalledWith('c1', validEmployeeDto.cpf);
    expect(repo.create).toHaveBeenCalledWith('c1', validEmployeeDto);
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call repo.update and contractsService.updateEmployeeContracts', async () => {
    repo.update.mockResolvedValue({ id: 'e1' });
    contractsService.updateEmployeeContracts.mockResolvedValue([]);

    const res = await service.update('c1', 'e1', validEmployeeDto, [], []);

    expect(repo.update).toHaveBeenCalledWith('c1', 'e1', validEmployeeDto);
    expect(contractsService.updateEmployeeContracts).toHaveBeenCalledWith(
      'c1',
      'e1',
      [],
      [],
    );

   
    expect(res).toHaveProperty('id', 'e1');
    expect(res).toHaveProperty('contracts');
    expect(res).toHaveProperty('lastContract');
  });
});