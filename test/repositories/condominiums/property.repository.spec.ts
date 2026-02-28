import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

describe('PropertyRepository', () => {
  const prisma = {
    properties: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should create property with condominium connect and address create', async () => {
    prisma.properties.create.mockResolvedValue({ id: 'p1' } as any);

    const repo = new PropertyRepository(prisma as any);
    const res = await repo.create('c1', { name: 'Prop', address: {} } as any);

    expect(prisma.properties.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Prop',
          condominium: { connect: { id: 'c1' } },
          propertyAddress: { create: {} },
        }),
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 'p1' });
  });
});