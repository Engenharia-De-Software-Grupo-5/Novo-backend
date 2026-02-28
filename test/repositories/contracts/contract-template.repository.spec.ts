import { ContractTemplateRepository } from "src/repositories/contract.templates/contract.template.repository";


describe('ContractTemplateRepository', () => {
  const prisma = {
    contractTemplates: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('create should call prisma.contractTemplates.create', async () => {
    prisma.contractTemplates.create.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.create({ name: 'T', template: 'X' } as any);

    expect(prisma.contractTemplates.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'T', template: 'X' }),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('getAll should call findMany with deletedAt null', async () => {
    prisma.contractTemplates.findMany.mockResolvedValue([{ id: 't1' }] as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.getAll();

    expect(prisma.contractTemplates.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
      }),
    );
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call findUnique', async () => {
    prisma.contractTemplates.findUnique.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.getById('t1');

    expect(prisma.contractTemplates.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1', deletedAt: null },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should soft delete', async () => {
    prisma.contractTemplates.update.mockResolvedValue({ id: 't1' } as any);

    const repo = new ContractTemplateRepository(prisma as any);
    const res = await repo.delete('t1');

    expect(prisma.contractTemplates.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });
});