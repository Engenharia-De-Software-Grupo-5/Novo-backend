import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

describe('TenantRepository', () => {
  const prisma = {
    tenants: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll should call tenants.findMany with deletedAt null and select tenantSelect', async () => {
    prisma.tenants.findMany.mockResolvedValue([{ id: 't1' }] as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.getAll();

    expect(prisma.tenants.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getById should call tenants.findFirst with id + deletedAt null and select tenantSelect', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.getById('t1');

    expect(prisma.tenants.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1', deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('getByCpf should call tenants.findFirst with cpf + deletedAt null and select tenantSelect', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.getByCpf('123');

    expect(prisma.tenants.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cpf: '123', deletedAt: null },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('create should upsert by cpf and connect addressId (create path)', async () => {
    prisma.tenants.upsert.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);

    const dto: any = {
      name: 'Tenant',
      cpf: '123',
      email: 'a@b.com',
      addressId: 'addr1',
      condominiumId: 'c1',
    };

    const res = await repo.create(dto);

    expect(prisma.tenants.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cpf: '123' },
        create: expect.objectContaining({
          name: 'Tenant',
          cpf: '123',
          email: 'a@b.com',
          condominiumId: 'c1',
          address: { connect: { id: 'addr1' } },
        }),
        update: expect.objectContaining({
          name: 'Tenant',
          cpf: '123',
          email: 'a@b.com',
          condominiumId: 'c1',
          deletedAt: null,
          address: { connect: { id: 'addr1' } },
        }),
        select: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 't1' });
  });

  it('create should include spouse/bankingInfo/professionalInfo/documents and recreate lists when provided', async () => {
    prisma.tenants.upsert.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);

    const dto: any = {
      name: 'Tenant',
      cpf: '123',
      addressId: 'addr1',
      condominiumId: 'c1',

      spouse: { name: 'Spouse', cpf: '999' },
      bankingInfo: { bank: 'X', agency: '1', accountNumber: '2', accountType: 'CC' },
      professionalInfo: {
        companyName: 'Co',
        companyPhone: '999',
        position: 'Dev',
        monthsWorking: 12,
        companyAddressId: 'addr2',
      },
      documents: { cpfFileId: 'f1', incomeProofId: 'f2' },

      emergencyContacts: [{ name: 'EC', phone: '1', relationship: 'F' }],
      additionalResidents: [{ name: 'AR', birthDate: '2020-01-01', relationship: 'S' }],
    };

    await repo.create(dto);

    expect(prisma.tenants.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          spouse: { upsert: { create: dto.spouse, update: dto.spouse } },
          bankingInfo: { upsert: { create: dto.bankingInfo, update: dto.bankingInfo } },
          professionalInfo: {
            upsert: {
              create: expect.objectContaining({
                companyName: 'Co',
                companyPhone: '999',
                position: 'Dev',
                monthsWorking: 12,
                addressId: 'addr2',
              }),
              update: expect.objectContaining({
                companyName: 'Co',
                companyPhone: '999',
                position: 'Dev',
                monthsWorking: 12,
                addressId: 'addr2',
              }),
            },
          },
          documents: { upsert: { create: dto.documents, update: dto.documents } },
          emergencyContacts: { deleteMany: {}, create: dto.emergencyContacts },
          additionalResidents: { deleteMany: {}, create: dto.additionalResidents },
        }),
        create: expect.objectContaining({
          spouse: { create: dto.spouse },
          bankingInfo: { create: dto.bankingInfo },
          professionalInfo: {
            create: expect.objectContaining({
              companyName: 'Co',
              companyPhone: '999',
              position: 'Dev',
              monthsWorking: 12,
              addressId: 'addr2',
            }),
          },
          documents: { create: dto.documents },
          emergencyContacts: { create: dto.emergencyContacts },
          additionalResidents: { create: dto.additionalResidents },
        }),
      }),
    );
  });

  it('update should update name/cpf and select tenantSelect', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.update('t1', { name: 'New', cpf: '456' } as any);

    expect(prisma.tenants.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
        data: { name: 'New', cpf: '456' },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteByCpf should soft delete tenant (cpf + deletedAt null)', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.deleteByCpf('123');

    expect(prisma.tenants.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { cpf: '123', deletedAt: null },
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteById should soft delete tenant by id', async () => {
    prisma.tenants.update.mockResolvedValue({ id: 't1' } as any);

    const repo = new TenantRepository(prisma as any);
    const res = await repo.deleteById('t1');

    expect(prisma.tenants.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 't1' },
        data: { deletedAt: expect.any(Date) },
        select: expect.any(Object),
      }),
    );
    expect(res).toEqual({ id: 't1' });
  });
});