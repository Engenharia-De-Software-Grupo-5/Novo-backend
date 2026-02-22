import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

describe('TenantRepository', () => {
  const prisma = {
    tenants: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new TenantRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getAll should list tenants (deletedAt null)', async () => {
    prisma.tenants.findMany.mockResolvedValue([{ id: 't1' }]);

    const res = await repo.getAll();
    expect(prisma.tenants.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      select: { id: true, name: true, cpf: true },
    });
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should findFirst by id + deletedAt null', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });

    const res = await repo.getById('t1');
    expect(prisma.tenants.findFirst).toHaveBeenCalledWith({
      where: { id: 't1', deletedAt: null },
      select: { id: true, name: true, cpf: true },
    });
    expect(res).toEqual({ id: 't1' });
  });

  it('getByCpf should findFirst by cpf + deletedAt null', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });

    await repo.getByCpf('123');
    expect(prisma.tenants.findFirst).toHaveBeenCalledWith({
      where: { cpf: '123', deletedAt: null },
      select: { id: true, name: true, cpf: true },
    });
  });

  it('create should create tenant with name/cpf only', async () => {
    prisma.tenants.create.mockResolvedValue({ id: 't1' });

    const dto = { name: 'A', cpf: '123' } as any;
    const res = await repo.create(dto);
    expect(prisma.tenants.create).toHaveBeenCalledWith({
      data: { name: 'A', cpf: '123' },
      select: { id: true, name: true, cpf: true },
    });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should update tenant', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' });

    const dto = { name: 'B', cpf: '999' } as any;
    await repo.update('t1', dto);
    expect(prisma.tenants.update).toHaveBeenCalledWith({
      where: { id: 't1' },
      data: { name: 'B', cpf: '999' },
      select: { id: true, name: true, cpf: true },
    });
  });

  it('delete should soft delete tenant', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' });

    await repo.delete('t1');
    const call = prisma.tenants.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 't1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});