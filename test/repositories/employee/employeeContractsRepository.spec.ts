import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';

describe('EmployeeContractsRepository', () => {
  const prisma = {
    employees: { findFirst: jest.fn() },
    employeeContracts: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new EmployeeContractsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('employeeExists should query employee by id + deletedAt null', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });
    await repo.employeeExists('e1');
    expect(prisma.employees.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
      select: { id: true },
    });
  });

  it('softDelete should set deletedAt', async () => {
    prisma.employeeContracts.update.mockResolvedValue({ id: 'c1' });
    await repo.softDelete('c1');
    const call = prisma.employeeContracts.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'c1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});