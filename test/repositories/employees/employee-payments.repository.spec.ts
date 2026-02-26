import { EmployeePaymentsRepository } from 'src/repositories/employees/employee-payments.repository';

describe('EmployeePaymentsRepository', () => {
  const prisma = {
    employees: { findFirst: jest.fn() },
    employeePayments: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('employeeExists should find employee not deleted', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeePaymentsRepository(prisma as any);
    await repo.employeeExists('e1');

    expect(prisma.employees.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
      select: { id: true },
    });
  });

  it('create should call employeePayments.create', async () => {
    prisma.employeePayments.create.mockResolvedValue({ id: 'p1' } as any);

    const repo = new EmployeePaymentsRepository(prisma as any);
    const res = await repo.create({
      employeeId: 'e1',
      value: 100,
      paymentDate: new Date('2026-02-18'),
      type: 'SALARY',
    } as any);

    expect(prisma.employeePayments.create).toHaveBeenCalledWith({ data: expect.any(Object) });
    expect(res).toEqual({ id: 'p1' });
  });

  it('listByEmployee should filter not deleted and order paymentDate desc', async () => {
    prisma.employeePayments.findMany.mockResolvedValue([] as any);

    const repo = new EmployeePaymentsRepository(prisma as any);
    await repo.listByEmployee('e1');

    expect(prisma.employeePayments.findMany).toHaveBeenCalledWith({
      where: { employeeId: 'e1', deletedAt: null },
      orderBy: { paymentDate: 'desc' },
    });
  });

  it('delete should soft delete with deletedAt', async () => {
    prisma.employeePayments.update.mockResolvedValue({ id: 'p1' } as any);

    const repo = new EmployeePaymentsRepository(prisma as any);
    await repo.delete('e1', 'p1');

    expect(prisma.employeePayments.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', employeeId: 'e1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
  });
});