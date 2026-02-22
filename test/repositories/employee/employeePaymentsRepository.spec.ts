import { EmployeePaymentsRepository } from 'src/repositories/employees/employee-payments.repository';

describe('EmployeePaymentsRepository', () => {
  const prisma = {
    employees: { findFirst: jest.fn() },
    employeePayments: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new EmployeePaymentsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('listByEmployee should order by paymentDate desc', async () => {
    prisma.employeePayments.findMany.mockResolvedValue([{ id: 'p1' }]);
    const res = await repo.listByEmployee('e1');
    expect(prisma.employeePayments.findMany).toHaveBeenCalledWith({
      where: { employeeId: 'e1', deletedAt: null },
      orderBy: { paymentDate: 'desc' },
    });
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('delete should set deletedAt', async () => {
    prisma.employeePayments.update.mockResolvedValue({ id: 'p1' });
    await repo.delete('e1', 'p1');
    const call = prisma.employeePayments.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'p1', employeeId: 'e1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});