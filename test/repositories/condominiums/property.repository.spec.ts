import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

describe('PropertyRepository', () => {
  const prisma = {
    $transaction: jest.fn(),
    properties: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
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
        where: { condominiumId: 'c1', deletedAt: null },
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('getById should call findFirst with condominiumId + propertyId', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.getById('c1', 'p1');

    expect(prisma.properties.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', condominiumId: 'c1', deletedAt: null },
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('getByIdentificador should call findUnique with identifier + condominiumId + deletedAt null', async () => {
    prisma.properties.findUnique.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.getByIdentificador('c1', 'A-101');

    expect(prisma.properties.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { identifier: 'A-101', condominiumId: 'c1', deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'p1' });
  });

  it('create should connect condominium and create nested propertyAddress from dto.address', async () => {
    prisma.properties.create.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.create('c1', {
      name: 'Prop',
      address: {
        street: 'X',
        number: '10',
      },
    } as any);

    expect(prisma.properties.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Prop',
          condominium: { connect: { id: 'c1' } },
          propertyAddress: {
            create: expect.objectContaining({
              street: 'X',
              number: '10',
            }),
          },
        }),
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('update should call prisma.properties.update with composite where (id + condominiumId + deletedAt null)', async () => {
    prisma.properties.update.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const dto: any = { name: 'New Name' };
    const res = await repo.update('c1', 'p1', dto);

    expect(prisma.properties.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', condominiumId: 'c1', deletedAt: null },
        data: dto,
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'p1' });
  });

  it('delete should soft delete property using condominiumId in where', async () => {
    prisma.properties.update.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.delete('c1', 'p1');

    expect(prisma.properties.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1', condominiumId: 'c1' },
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('getPaginated should run transaction with count + findMany using pagination', async () => {
    prisma.properties.count.mockResolvedValue(3);
    prisma.properties.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }] as any);
    prisma.$transaction.mockResolvedValue([3, [{ id: 'p1' }, { id: 'p2' }]]);

    const repo = new PropertyRepository(prisma as any);
    const out = await repo.getPaginated('c1', { page: 2, limit: 2 } as any);

    // We don't assert the exact dynamic where here (buildDynamicWhere), only the pagination + transaction shape.
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.properties.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.any(Object) }),
    );
    expect(prisma.properties.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        select: expect.any(Object),
        take: 2,
        skip: 2,
        orderBy: { identifier: 'asc' },
      }),
    );

    expect(out).toEqual({
      items: [{ id: 'p1' }, { id: 'p2' }],
      meta: {
        totalItems: 3,
        totalPages: 2,
        page: 2,
        limit: 2,
      },
    });
  });
});