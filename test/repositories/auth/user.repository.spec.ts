import { UserRepository } from 'src/repositories/auth/user.repository';

describe('UserRepository', () => {
  const prisma = {
    users: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAll should list users for condominium (not deleted)', async () => {
    prisma.users.findMany.mockResolvedValue([{ id: 'u1' }] as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.getAll('c1');

    expect(prisma.users.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          accesses: { some: { condominiumsId: 'c1' } },
        },
        include: expect.objectContaining({
          accesses: expect.objectContaining({
            where: { deletedAt: null },
            select: expect.any(Object),
          }),
        }),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual([{ id: 'u1' }]);
  });

  it('findByEmail should call users.findUnique (not deleted)', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 'u1' } as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.findByEmail('a@b.com');

    expect(prisma.users.findFirst).not.toHaveBeenCalled();

    expect(prisma.users.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'a@b.com', deletedAt: null },
        omit: { createdAt: true, updatedAt: true },
        include: expect.any(Object),
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });

  it('create should create user with password and attach access', async () => {
    prisma.users.create.mockResolvedValue({ id: 'u1' } as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.create(
      { name: 'A', email: 'a@b.com', role: 'ADMIN', status: 'ACTIVE' } as any,
      'hashed',
      'c1',
    );

    expect(prisma.users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'A',
          email: 'a@b.com',
          password: 'hashed',
          accesses: {
            create: expect.objectContaining({
              condominium: { connect: { id: 'c1' } },
              permission: { connect: { name: 'ADMIN' } },
              status: 'ACTIVE',
            }),
          },
        }),
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });

  it('update should update access (permission/status) using composite key', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' } as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.update('u1', { role: 'MANAGER', status: 'INACTIVE' } as any, 'c1');

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
        data: {
          accesses: {
            update: {
              where: {
                usersId_condominiumsId: { usersId: 'u1', condominiumsId: 'c1' },
              },
              data: {
                deletedAt: null,
                permission: { connect: { name: 'MANAGER' } },
                status: 'INACTIVE',
              },
            },
          },
        },
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });

  it('updatePassword should update password and keep include/omit/where(deletedAt null)', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' } as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.updatePassword('u1', 'hashed');

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
        data: { password: 'hashed' },
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });

  it('delete should soft delete access in given condominium', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' } as any);

    const repo = new UserRepository(prisma as any);
    const res = await repo.delete('u1', 'c1');

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
        data: {
          accesses: {
            update: {
              where: {
                usersId_condominiumsId: { usersId: 'u1', condominiumsId: 'c1' },
              },
              data: expect.objectContaining({
                deletedAt: expect.any(Date),
              }),
            },
          },
        },
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });
});