import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

describe('EmployeeRepository', () => {
  const prisma = {
    employees: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    bankData: {
      upsert: jest.fn(),
    },
  };

  const repo = new EmployeeRepository(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getById should call prisma.employees.findFirst with condId, employeeId and deletedAt null', async () => {
    prisma.employees.findFirst.mockResolvedValue({ id: 'e1' });

    const res = await repo.getById('c1', 'e1');

    expect(prisma.employees.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'e1', deletedAt: null, condId: 'c1' },
      }),
    );
    expect(res).toEqual({ id: 'e1' });
  });
});