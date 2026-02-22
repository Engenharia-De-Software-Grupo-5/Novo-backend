import { AuthRepository } from 'src/repositories/auth/auth.repository';

describe('AuthRepository', () => {
  const prisma = {
    users: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new AuthRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('getUserByEmailOrCpf should query by email OR cpf with permission include and omit', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' });

    const res = await repo.getUserByEmailOrCpf('login');

    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ email: 'login' }, { cpf: 'login' }],
        deletedAt: null,
      },
      include: {
        permission: { select: { id: true, name: true, functionalities: true } },
      },
      omit: { permissionsId: true, createdAt: true, updatedAt: true },
    });
    expect(res).toEqual({ id: 'u1' });
  });

  it('getUserByEmail should return id when found', async () => {
    prisma.users.findFirst.mockResolvedValue({ id: 'u1' });

    await expect(repo.getUserByEmail('a@a.com')).resolves.toBe('u1');
    expect(prisma.users.findFirst).toHaveBeenCalledWith({
      where: { email: 'a@a.com', deletedAt: null },
      select: { id: true },
    });
  });

  it('getUserByEmail should return undefined when not found', async () => {
    prisma.users.findFirst.mockResolvedValue(null);

    await expect(repo.getUserByEmail('a@a.com')).resolves.toBeUndefined();
  });

  it('updateUserPassword should update password', async () => {
    prisma.users.update.mockResolvedValue({ id: 'u1' });

    await repo.updateUserPassword('u1', 'hashed');
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: 'u1' },
      data: { password: 'hashed' },
    });
  });
});