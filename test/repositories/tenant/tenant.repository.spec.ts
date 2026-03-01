import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

describe('TenantRepository', () => {
  const prisma = {
    tenants: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  const repo = new TenantRepository(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll should call prisma.tenants.findMany', async () => {
    prisma.tenants.findMany.mockResolvedValue([{ id: 't1' }]);

    const res = await repo.getAll('c1');

    expect(prisma.tenants.findMany).toHaveBeenCalled();
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call prisma.tenants.findFirst (implementation)', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });

    const res = await repo.getById('c1', 't1');

    expect(prisma.tenants.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call prisma.tenants.upsert', async () => {
    prisma.tenants.upsert.mockResolvedValue({ id: 't1' });

    const res = await repo.create('c1', { cpf: '123', name: 'A' } as any);

    expect(prisma.tenants.upsert).toHaveBeenCalled();
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call prisma.tenants.update with where.id only (as implementation)', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' });

    const res = await repo.update('c1', 't1', { name: 'New' } as any);

    expect(prisma.tenants.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteById should call prisma.tenants.update with where.id only and set deletedAt', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' });

    const res = await repo.deleteById('c1', 't1');

    expect(prisma.tenants.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });
});