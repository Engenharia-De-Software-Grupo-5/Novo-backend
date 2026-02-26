import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

describe('PropertyRepository', () => {
  const prisma = {
    properties: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('getAll should list properties for condominium', async () => {
    prisma.properties.findMany.mockResolvedValue([{ id: 'p1' }] as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.getAll('c1');

    expect(prisma.properties.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { condominiumId: 'c1', deletedAt: null }, // ✅ singular
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('create should create property with condominiumId', async () => {
    prisma.properties.create.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.create('c1', { name: 'Prop' } as any);

    expect(prisma.properties.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          condominiumId: 'c1', // ✅ singular
          name: 'Prop',
        }),
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('getById should call findFirst with condominiumId + propertyId', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.getById('c1', 'p1');

    expect(prisma.properties.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', condominiumId: 'c1', deletedAt: null }, // ✅ singular
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('delete should soft delete property', async () => {
    prisma.properties.update.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.delete('c1', 'p1');

    expect(prisma.properties.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'p1' }),
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });
});