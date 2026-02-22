import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

describe('EmployeeRepository', () => {
  const prisma = {
    employees: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new EmployeeRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getAll should list employees', async () => {
    prisma.employees.findMany.mockResolvedValue([{ id: 'e1' }]);
    const res = await repo.getAll();
    expect(prisma.employees.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null }, select: expect.any(Object) }),
    );
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('getByCpf should query unique by cpf + deletedAt null', async () => {
    prisma.employees.findUnique.mockResolvedValue({ id: 'e1' });
    await repo.getByCpf('123');
    expect(prisma.employees.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { cpf: '123', deletedAt: null } }),
    );
  });

  it('create should upsert by cpf and create bankData.create', async () => {
    prisma.employees.upsert.mockResolvedValue({ id: 'e1' });
    await repo.create({ cpf: '123', name: 'A', bankData: { x: 1 } } as any);

    expect(prisma.employees.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cpf: '123' },
        create: expect.objectContaining({
          cpf: '123',
          name: 'A',
          bankData: { create: {} },
        }),
      }),
    );
  });

  it('deleteByCpf should soft delete', async () => {
    prisma.employees.update.mockResolvedValue({ id: 'e1' });
    await repo.deleteByCpf('123');
    const call = prisma.employees.update.mock.calls[0][0];
    expect(call.where).toEqual({ cpf: '123', deletedAt: null });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});