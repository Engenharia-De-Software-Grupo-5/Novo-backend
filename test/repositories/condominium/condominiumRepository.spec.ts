import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';

describe('CondominiumRepository', () => {
  const prisma = {
    condominiums: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new CondominiumRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getAll should select condominium projection', async () => {
    prisma.condominiums.findMany.mockResolvedValue([{ id: 'c1' }]);

    await repo.getAll();

    expect(prisma.condominiums.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
        select: expect.any(Object),
      }),
    );
  });

  it('getById should findFirst by id + deletedAt null', async () => {
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });

    const res = await repo.getById('c1');
    expect(prisma.condominiums.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1', deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('getByName should findFirst by name + deletedAt null', async () => {
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });

    await repo.getByName('Condo');
    expect(prisma.condominiums.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'Condo', deletedAt: null },
      }),
    );
  });

  it('create should create condominium with nested address.create', async () => {
    prisma.condominiums.create.mockResolvedValue({ id: 'c1' });

    const dto = {
      name: 'Condo',
      description: 'x',
      address: {
        zip: '58000-000',
        neighborhood: 'Centro',
        city: 'JP',
        complement: 'A',
        number: '10',
        street: 'Rua',
        uf: 'PB',
      },
    } as any;

    await repo.create(dto);

    expect(prisma.condominiums.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Condo',
          address: { create: dto.address },
        }),
        select: expect.any(Object),
      }),
    );
  });

  it('update should update condominium with nested address.update', async () => {
    prisma.condominiums.update.mockResolvedValue({ id: 'c1' });

    const dto = {
      name: 'Condo2',
      description: 'y',
      address: { zip: 'x' },
    } as any;

    await repo.update('c1', dto);

    expect(prisma.condominiums.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1' },
        data: expect.objectContaining({
          name: 'Condo2',
          address: { update: expect.any(Object) },
        }),
        select: expect.any(Object),
      }),
    );
  });

  it('delete should soft delete condominium', async () => {
    prisma.condominiums.update.mockResolvedValue({ id: 'c1' });

    await repo.delete('c1');
    const call = prisma.condominiums.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'c1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});