import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

describe('ContractTemplateRepository', () => {
  const prisma = {
    contractTemplates: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should call prisma.contractTemplates.create', async () => {
    prisma.contractTemplates.create.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.create('c1', { name: 'T', template: 'X' } as any);

    expect(prisma.contractTemplates.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'T', template: 'X', condominiumId: 'c1' }),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('getAll should call findMany with deletedAt null', async () => {
    prisma.contractTemplates.findMany.mockResolvedValue([{ id: 't1' }] as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.getAll('c1');

    expect(prisma.contractTemplates.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ deletedAt: null, condominiumId: 'c1' }),
      }),
    );
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call findUnique', async () => {
    prisma.contractTemplates.findUnique.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.getById('c1', 't1');

    expect(prisma.contractTemplates.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1', condominiumId: 'c1', deletedAt: null },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should soft delete', async () => {
    prisma.contractTemplates.update.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.delete('c1', 't1');

    expect(prisma.contractTemplates.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1', condominiumId: 'c1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });
});