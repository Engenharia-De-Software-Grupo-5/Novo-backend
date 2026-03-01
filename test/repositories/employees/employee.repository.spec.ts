import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

describe('EmployeeRepository', () => {
  const prisma = {
    employees: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll should return employees with employeeSelect', async () => {
    prisma.employees.findMany.mockResolvedValue([{ id: 'e1' }] as any);

    const repo = new EmployeeRepository(prisma as any);
    const res = await repo.getAll();

    expect(prisma.employees.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('getById should return employee', async () => {
    prisma.employees.findUnique.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeRepository(prisma as any);
    const res = await repo.getById('e1');

    expect(prisma.employees.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'e1', deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'e1' });
  });

  it('create should call prisma.employees.upsert (by cpf) and select employeeSelect', async () => {
    prisma.employees.upsert.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeRepository(prisma as any);

    const dto: any = {
      cpf: '123',
      name: 'Emp',
      role: 'DEV',
      contractType: 'CLT',
      hireDate: new Date('2026-02-01'),
      baseSalary: 1000,
      workload: 40,
      status: 'ACTIVE',
      bankData: {
        bank: 'BB',
        accountType: 'CHECKING',
        accountNumber: '12345-6',
        agency: '0001',
      },
    };

    const res = await repo.create(dto);

    expect(prisma.employees.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cpf: '123' },
        update: expect.objectContaining({
          cpf: '123',
          name: 'Emp',
          bankData: {
            upsert: {
              update: {
                bank: 'BB',
                accountType: 'CHECKING',
                accountNumber: '12345-6',
                agency: '0001',
              },
              create: {
                bank: 'BB',
                accountType: 'CHECKING',
                accountNumber: '12345-6',
                agency: '0001',
              },
            },
          },
          deletedAt: null,
        }),
        create: expect.objectContaining({
          cpf: '123',
          name: 'Emp',
          bankData: {
            create: {
              bank: 'BB',
              accountType: 'CHECKING',
              accountNumber: '12345-6',
              agency: '0001',
            },
          },
        }),
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call prisma.employees.update', async () => {
    prisma.employees.update.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeRepository(prisma as any);
    const res = await repo.update('e1', { name: 'New' } as any);

    expect(prisma.employees.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'e1' },
        data: expect.objectContaining({ name: 'New' }),
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'e1' });
  });

  it('delete should soft delete employee', async () => {
    prisma.employees.update.mockResolvedValue({ id: 'e1' } as any);

    const repo = new EmployeeRepository(prisma as any);
    const res = await repo.delete('e1');

    expect(prisma.employees.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'e1', deletedAt: null },
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'e1' });
  });
});