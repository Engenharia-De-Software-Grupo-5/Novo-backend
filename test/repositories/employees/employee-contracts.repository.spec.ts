import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';

describe('EmployeeContractsRepository', () => {
  const prisma = {
    employees: {
      findFirst: jest.fn(),
    },
    employeeContracts: {
      findFirst: jest.fn(),
    },
  };

  const repo = new EmployeeContractsRepository(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('employeeExists should query prisma.employees.findFirst with condId and id', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });

    await repo.employeeExists('c1', 'e1');

    expect(prisma.employees.findFirst).toHaveBeenCalled();
  });

  it('findForEmployee should query prisma.employeeContracts.findFirst with condId, employeeId and contractId', async () => {
    prisma.employeeContracts.findFirst.mockResolvedValue({ id: 'ec1' });

    const res = await repo.findForEmployee('c1', 'e1', 'ct1');

    expect(prisma.employeeContracts.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: 'ec1' });
  });
});