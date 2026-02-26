import { ContractRepository } from 'src/repositories/contracts/contract.repository';

describe('ContractRepository', () => {
  const prisma = {
    contracts: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('create should omit "file" from dto before sending to prisma', async () => {
    prisma.contracts.create.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ContractRepository(prisma as any);

    const dto: any = {
      tenantId: 't1',
      propertyId: 'p1',
      contractTemplateId: 'ct1',
      description: 'x',
      file: { any: true },
    };

    const res = await repo.create(dto);

    expect(prisma.contracts.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({ file: expect.anything() }),
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('updateUrl should update contractUrl', async () => {
    prisma.contracts.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.updateUrl('c1', 'url');

    expect(prisma.contracts.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1' },
        data: { contractUrl: 'url' },
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should soft delete', async () => {
    prisma.contracts.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ContractRepository(prisma as any);
    const res = await repo.delete('c1');

    expect(prisma.contracts.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });
});