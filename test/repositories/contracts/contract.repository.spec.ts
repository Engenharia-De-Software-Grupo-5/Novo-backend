import { ContractRepository } from 'src/repositories/contracts/contract.repository';

describe('ContractRepository', () => {
  const prisma = {
    $transaction: jest.fn(),
    contracts: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    properties: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('getAll should filter by condominiumId via property relation', async () => {
    prisma.contracts.findMany.mockResolvedValue([{ id: 'ct1' }] as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.getAll('c1');

    expect(prisma.contracts.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null, property: { condominiumId: 'c1' } },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual([{ id: 'ct1' }]);
  });

  it('getById should call findUnique with property condominiumId constraint', async () => {
    prisma.contracts.findUnique.mockResolvedValue({ id: 'ct1' } as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.getById('c1', 'ct1');

    expect(prisma.contracts.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'ct1',
          deletedAt: null,
          property: { condominiumId: 'c1' },
        },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'ct1' });
  });

  it('create should throw when property does not belong to condominium', async () => {
    prisma.properties.findFirst.mockResolvedValue(null);

    const repo = new ContractRepository(prisma as any);
    const dto: any = {
      tenantId: 't1',
      propertyId: 'p1',
      description: 'x',
      content: 'y',
      startDate: '2026-02-01',
      dueDate: '2026-03-01',
      file: { any: true },
    };

    await expect(repo.create('c1', dto)).rejects.toThrow(
      'Property não pertence a esse condomínio',
    );

    expect(prisma.contracts.create).not.toHaveBeenCalled();
  });

  it('create should omit file and connect tenant/property + contractTemplate when provided', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' } as any);
    prisma.contracts.create.mockResolvedValue({ id: 'ct1' } as any);

    const repo = new ContractRepository(prisma as any);
    const dto: any = {
      tenantId: 't1',
      propertyId: 'p1',
      contractTemplateId: 'tpl1',
      description: 'desc',
      content: 'content',
      startDate: '2026-02-01',
      dueDate: '2026-03-01',
      file: { any: true },
    };

    const res = await repo.create('c1', dto);

    expect(prisma.properties.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'p1', condominiumId: 'c1' } }),
    );
    expect(prisma.contracts.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description: 'desc',
          content: 'content',
          startDate: '2026-02-01',
          dueDate: '2026-03-01',
          tenant: { connect: { id: 't1' } },
          property: { connect: { id: 'p1' } },
          contractTemplate: { connect: { id: 'tpl1' } },
        }),
        select: expect.any(Object),
      }),
    );
    // guarantee file isn't forwarded
    expect(prisma.contracts.create.mock.calls[0][0].data).not.toHaveProperty('file');
    expect(res).toEqual({ id: 'ct1' });
  });

  it('update should update contract with property condominiumId constraint and omit file', async () => {
    prisma.contracts.update.mockResolvedValue({ id: 'ct1' } as any);

    const repo = new ContractRepository(prisma as any);
    const dto: any = { description: 'new', file: { any: true } };
    const res = await repo.update('c1', 'ct1', dto);

    expect(prisma.contracts.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ct1', property: { condominiumId: 'c1' } },
        data: expect.objectContaining({ description: 'new' }),
        select: expect.any(Object),
      }),
    );
    expect(prisma.contracts.update.mock.calls[0][0].data).not.toHaveProperty('file');
    expect(res).toEqual({ id: 'ct1' });
  });

  it('updateUrl should update contractUrl with property condominiumId constraint', async () => {
    prisma.contracts.update.mockResolvedValue({ id: 'ct1' } as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.updateUrl('c1', 'ct1', 'url');

    expect(prisma.contracts.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ct1', property: { condominiumId: 'c1' } },
        data: { contractUrl: 'url' },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'ct1' });
  });

  it('delete should soft delete with property condominiumId constraint', async () => {
    prisma.contracts.update.mockResolvedValue({ id: 'ct1' } as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.delete('c1', 'ct1');

    expect(prisma.contracts.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ct1', property: { condominiumId: 'c1' } },
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'ct1' });
  });

  it('listByTenant should order desc and filter by tenant and condominium', async () => {
    prisma.contracts.findMany.mockResolvedValue([{ id: 'ct1' }] as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.listByTenant('c1', 't1');

    expect(prisma.contracts.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          tenant: { id: 't1' },
          property: { condominiumId: 'c1' },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(res).toEqual([{ id: 'ct1' }]);
  });

  it('listByProperty should order desc and filter by property id + condominium', async () => {
    prisma.contracts.findMany.mockResolvedValue([{ id: 'ct1' }] as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.listByProperty('c1', 'p1');

    expect(prisma.contracts.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          property: { id: 'p1', condominiumId: 'c1' },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
    expect(res).toEqual([{ id: 'ct1' }]);
  });
});