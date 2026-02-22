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
  } as any;

  const repo = new EmployeeBenefitsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('findByEmployee should list benefits ordered by referenceYear desc', async () => {
    prisma.employeeBenefits.findMany.mockResolvedValue([{ id: 'b1' }]);
    const res = await repo.findByEmployee('e1');
    expect(prisma.employeeBenefits.findMany).toHaveBeenCalledWith({
      where: { employeeId: 'e1', deletedAt: null },
      orderBy: { referenceYear: 'desc' },
    });
    expect(res).toEqual([{ id: 'b1' }]);
  });

  it('softDelete should set deletedAt', async () => {
    prisma.employeeBenefits.update.mockResolvedValue({ id: 'b1' });
    await repo.softDelete('b1');
    const call = prisma.employeeBenefits.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'b1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});