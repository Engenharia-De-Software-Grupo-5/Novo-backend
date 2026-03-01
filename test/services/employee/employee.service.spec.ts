import { EmployeeService } from 'src/services/employees/employee.service';

describe('EmployeeService', () => {
  const repo = {
    getByCpf: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const contractsService = {
    updateEmployeeContracts: jest.fn(),
  };

  const service = new EmployeeService(repo as any, contractsService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should call repo.create when cpf not exists', async () => {
    repo.getByCpf.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: 'e1' });

    const dto = { cpf: '123', name: 'A' } as any;

    const res = await service.create('c1', dto);

    expect(repo.getByCpf).toHaveBeenCalledWith('c1', '123');
    expect(repo.create).toHaveBeenCalledWith('c1', dto);
    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call repo.update and contractsService.updateEmployeeContracts', async () => {
    repo.update.mockResolvedValue({ id: 'e1' });
    contractsService.updateEmployeeContracts.mockResolvedValue([]);

    const res = await service.update('c1', 'e1', {} as any, []);

    expect(repo.update).toHaveBeenCalled();
    expect(contractsService.updateEmployeeContracts).toHaveBeenCalled();
    expect(res).toEqual({
      id: 'e1',
      contracts: [],
      lastContract: undefined,
    });
  });
});