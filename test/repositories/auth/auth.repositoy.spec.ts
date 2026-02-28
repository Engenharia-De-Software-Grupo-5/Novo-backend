import { AuthRepository } from 'src/repositories/auth/auth.repository';

describe('AuthRepository', () => {
  const prisma = {
    users: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUserByEmail should call prisma.users.findFirst with include accesses and deletedAt null', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' } as any);

    const repo = new AuthRepository(prisma as any);
    const res = await repo.getUserByEmail('test@test.com');

    expect(prisma.users.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'test@test.com', deletedAt: null },
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );

    expect(res).toEqual({ id: 'u1' });
  });

  it('getUserIdByEmail should return id or undefined', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' } as any);

    const repo = new AuthRepository(prisma as any);
    await expect(repo.getUserIdByEmail('a@b.com')).resolves.toBe('u1');

    prisma.users.findFirst.mockResolvedValue(null);
    await expect(repo.getUserIdByEmail('a@b.com')).resolves.toBeUndefined();
  });

  it('updateUserPassword should call prisma.users.update', async () => {
    prisma.users.update.mockResolvedValue({} as any);

    const repo = new AuthRepository(prisma as any);
    await repo.updateUserPassword('u1', 'hashed');

    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { password: 'hashed' },
    });
  });
});