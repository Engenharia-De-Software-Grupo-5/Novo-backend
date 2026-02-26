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
  };

  beforeEach(() => jest.clearAllMocks());

  it('employeeExists should find employee not deleted', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeContractsRepository(prisma as any);
    await repo.employeeExists('e1');

    expect(prisma.employees.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
      select: { id: true },
    });
  });

  it('findForEmployee should filter by employeeId, id, not deleted', async () => {
    prisma.employeeContracts.findFirst.mockResolvedValue({ id: 'c1' } as any);

    const repo = new EmployeeContractsRepository(prisma as any);
    const res = await repo.findForEmployee('e1', 'c1');

    expect(prisma.employeeContracts.findFirst).toHaveBeenCalledWith({
      where: { id: 'c1', employeeId: 'e1', deletedAt: null },
    });
    expect(res).toEqual({ id: 'c1' });
  });

  it('softDelete should set deletedAt', async () => {
    prisma.employeeContracts.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new EmployeeContractsRepository(prisma as any);
    await repo.softDelete('c1');

    expect(prisma.employeeContracts.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});