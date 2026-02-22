import { UserRepository } from 'src/repositories/auth/user.repository';

describe('UserRepository', () => {
  const prisma = {
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  const repo = new UserRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getAll should list users with permission include and omit', async () => {
    prisma.users.findMany.mockResolvedValue([{ id: 'u1' }]);

    const res = await repo.getAll();

    expect(prisma.users.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null },
        include: {
          permission: {
            select: { id: true, name: true, functionalities: true },
          },
        },
        omit: expect.any(Object),
      }),
    );
    expect(res).toEqual([{ id: 'u1' }]);
  });

  it('getById should query by id + deletedAt null', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 'u1' });

    const res = await repo.getById('u1');

    expect(prisma.users.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
      }),
    );
    expect(res).toEqual({ id: 'u1' });
  });

  it('getUserPaginated should call $transaction and return meta', async () => {
    const countPromise = Symbol('countPromise');
    const findManyPromise = Symbol('findManyPromise');

    prisma.users.count.mockReturnValue(countPromise);
    prisma.users.findMany.mockReturnValue(findManyPromise);

    prisma.$transaction.mockResolvedValueOnce([11, [{ id: 'u1' }]]);

    const res = await repo.getUserPaginated({ page: 2, limit: 5 } as any);

    expect(prisma.$transaction).toHaveBeenCalledWith([countPromise, findManyPromise]);
    expect(prisma.users.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.any(Object) }),
    );
    expect(prisma.users.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        take: 5,
        skip: 5,
        orderBy: { name: 'asc' },
      }),
    );

    expect(res).toEqual({
      items: [{ id: 'u1' }],
      meta: {
        totalItems: 11,
        totalPages: 3,
        page: 2,
        limit: 5,
      },
    });
  });

  it('create should upsert by email and return created user', async () => {
    prisma.users.upsert.mockResolvedValue({ id: 'u1' });

    const dto = { email: 'a@a.com', name: 'A' } as any;
    const res = await repo.create(dto, 'hashed');

    expect(prisma.users.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'a@a.com' },
        update: expect.objectContaining({ email: 'a@a.com', name: 'A' }),
        create: expect.objectContaining({ email: 'a@a.com', name: 'A' }),
      }),
    );
    expect(res).toEqual({ id: 'u1' });
  });

  it('update should update user by id + deletedAt null', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' });

    const dto = { name: 'B' } as any;
    const res = await repo.update('u1', dto);

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
        data: dto,
      }),
    );
    expect(res).toEqual({ id: 'u1' });
  });

  it('updatePassword should update password field', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' });

    await repo.updatePassword('u1', 'hashed');
    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1', deletedAt: null },
        data: { password: 'hashed' },
      }),
    );
  });

  it('delete should soft delete user (sets deletedAt)', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' });

    await repo.delete('u1');

    const call = prisma.users.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'u1', deletedAt: null });
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });

  it('getByIdWithPassword should select password only', async () => {
    prisma.users.findUnique.mockResolvedValue({ password: 'x' });

    const res = await repo.getByIdWithPassword('u1');
    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { id: 'u1', deletedAt: null },
      select: { password: true },
    });
    expect(res).toEqual({ password: 'x' });
  });
});