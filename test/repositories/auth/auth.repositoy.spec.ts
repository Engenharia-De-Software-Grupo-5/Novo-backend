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

  it('getUserByEmailOrCpf should query by OR(email/cpf) and include accesses', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' } as any);

    const repo = new AuthRepository(prisma as any);
    const res = await repo.getUserByEmailOrCpf('login');

    expect(prisma.users.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ email: 'login' }, { cpf: 'login' }], deletedAt: null },
        include: expect.any(Object),
        omit: { createdAt: true, updatedAt: true },
      }),
    );
    expect(res).toEqual({ id: 'u1' });
  });

  it('getUserByEmail should return id or undefined', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' });

    const repo = new AuthRepository(prisma as any);
    await expect(repo.getUserByEmail('a@b.com')).resolves.toBe('u1');

    prisma.users.findFirst.mockResolvedValue(null);
    await expect(repo.getUserByEmail('x@x.com')).resolves.toBeUndefined();
  });

  it('updateUserPassword should update password', async () => {
    prisma.users.update.mockResolvedValue({} as any);

    const repo = new AuthRepository(prisma as any);
    await repo.updateUserPassword('u1', 'hashed');

    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { password: 'hashed' },
    });
  });
});