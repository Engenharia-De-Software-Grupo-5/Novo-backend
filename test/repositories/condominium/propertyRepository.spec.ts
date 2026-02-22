import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

describe('PropertyRepository', () => {
  const prisma = {
    properties: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new PropertyRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getAll should filter by condominiumId and deletedAt null', async () => {
    prisma.properties.findMany.mockResolvedValue([{ id: 'p1' }]);
    await repo.getAll('c1');
    expect(prisma.properties.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null, condominiumId: 'c1' } }),
    );
  });

  it('getById should filter by id + condominiumId', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    await repo.getById('c1', 'p1');
    expect(prisma.properties.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'p1', deletedAt: null, condominiumId: 'c1' } }),
    );
  });

  it('delete should set deletedAt', async () => {
    prisma.properties.update.mockResolvedValue({ id: 'p1' });
    await repo.delete('c1', 'p1');
    const call = prisma.properties.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'p1', condominiumId: 'c1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});