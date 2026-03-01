import { EmployeeBenefitsRepository } from 'src/repositories/employees/employee-benefits.repository';

describe('EmployeeBenefitsRepository', () => {
  const prisma = {
    employees: { findFirst: jest.fn() },
    employeeBenefits: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('findEmployeeById should query employees not deleted', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeBenefitsRepository(prisma as any);
    await repo.findEmployeeById('e1');

    expect(prisma.employees.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
    });
  });

  it('create should call employeeBenefits.create', async () => {
    prisma.employeeBenefits.create.mockResolvedValue({ id: 'b1' } as any);

    const repo = new EmployeeBenefitsRepository(prisma as any);
    const res = await repo.create({ employeeId: 'e1', type: 'VACATION', referenceYear: 2026, value: 10 } as any);

    expect(prisma.employeeBenefits.create).toHaveBeenCalledWith({ data: expect.any(Object) });
    expect(res).toEqual({ id: 'b1' });
  });

  it('findByEmployee should order by referenceYear desc', async () => {
    prisma.employeeBenefits.findMany.mockResolvedValue([] as any);

    const repo = new EmployeeBenefitsRepository(prisma as any);
    await repo.findByEmployee('e1');

    expect(prisma.employeeBenefits.findMany).toHaveBeenCalledWith({
      where: { employeeId: 'e1', deletedAt: null },
      orderBy: { referenceYear: 'desc' },
    });
  });

  it('softDelete should set deletedAt', async () => {
    prisma.employeeBenefits.update.mockResolvedValue({ id: 'b1' } as any);

    const repo = new EmployeeBenefitsRepository(prisma as any);
    await repo.softDelete('b1');

    expect(prisma.employeeBenefits.update).toHaveBeenCalledWith({
      where: { id: 'b1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});