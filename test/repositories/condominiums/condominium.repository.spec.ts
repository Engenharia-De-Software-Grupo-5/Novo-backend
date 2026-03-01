import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';

describe('CondominiumRepository', () => {
  const prisma = {
    condominiums: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('create should call prisma.condominiums.create', async () => {
    prisma.condominiums.create.mockResolvedValue({ id: 'c1' } as any);

    const repo = new CondominiumRepository(prisma as any);
    const res = await repo.create({ name: 'Condo' } as any);

    expect(prisma.condominiums.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'Condo' }),
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('getAll should call prisma.condominiums.findMany with deletedAt null', async () => {
    prisma.condominiums.findMany.mockResolvedValue([{ id: 'c1' }] as any);

    const repo = new CondominiumRepository(prisma as any);
    const res = await repo.getAll();

    expect(prisma.condominiums.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null }),
      }),
    );
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should call prisma.condominiums.findFirst', async () => {
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' } as any);

    const repo = new CondominiumRepository(prisma as any);
    const res = await repo.getById('c1');

    expect(prisma.condominiums.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1', deletedAt: null },
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should soft delete condominium', async () => {
    prisma.condominiums.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new CondominiumRepository(prisma as any);
    const res = await repo.delete('c1');

    expect(prisma.condominiums.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });
});