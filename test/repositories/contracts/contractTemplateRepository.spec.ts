import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

describe('ContractTemplateRepository', () => {
  const prisma = {
    contractTemplates: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new ContractTemplateRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getById should query by id + deletedAt null', async () => {
    prisma.contractTemplates.findUnique.mockResolvedValue({ id: 'ct1' });
    const res = await repo.getById('ct1');
    expect(prisma.contractTemplates.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'ct1', deletedAt: null } }),
    );
    expect(res).toEqual({ id: 'ct1' });
  });

  it('getAll should add name filter when provided', async () => {
    prisma.contractTemplates.findMany.mockResolvedValue([]);
    await repo.getAll('abc');
    expect(prisma.contractTemplates.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          name: expect.objectContaining({ contains: 'abc', mode: 'insensitive' }),
        }),
      }),
    );
  });

  it('create should create template', async () => {
    prisma.contractTemplates.create.mockResolvedValue({ id: 'ct1' });
    const dto = { name: 'n', description: 'd', template: 't' } as any;
    await repo.create(dto);
    expect(prisma.contractTemplates.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: 'n', description: 'd', template: 't' },
      }),
    );
  });

  it('delete should soft delete', async () => {
    prisma.contractTemplates.update.mockResolvedValue({ id: 'ct1' });
    await repo.delete('ct1');
    const call = prisma.contractTemplates.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'ct1' });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });
});