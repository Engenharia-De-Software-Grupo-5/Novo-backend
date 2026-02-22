import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { PrismaService } from '../../src/common/database/prisma.service';
import { ROLES_KEY } from '../../src/common/decorators';

function createContext(user: any) {
  const normalizedUser =
    user === undefined || user === null
      ? user
      : {
          condominium: [],
          ...user,
        };

  return {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: normalizedUser }),
    }),
  } as any;
}

describe('RolesGuard', () => {
  let reflector: Reflector;
  let prisma: PrismaService;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    prisma = {
      permissions: {
        findUnique: jest.fn(),
      },
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow when no roles are required', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const guard = new RolesGuard(reflector, prisma);
    const ctx = createContext({ id: 'u1', permission: 'p1' });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(prisma.permissions.findUnique).not.toHaveBeenCalled();
  });

  it('should throw when user is missing', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['X'])
      .mockReturnValueOnce([]);

    const guard = new RolesGuard(reflector, prisma);
    const ctx = createContext(undefined);

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new ForbiddenException('Token inválido.'),
    );
  });

  it('should throw when token has no permission', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['X'])
      .mockReturnValueOnce([]);

    const guard = new RolesGuard(reflector, prisma);


    const ctx = createContext({ id: 'u1', condominium: [] });

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new ForbiddenException('Token sem permissão definida.'),
    );
  });

  it('should throw when permission is invalid or has no functionalities', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['X'])
      .mockReturnValueOnce([]);

    (prisma.permissions.findUnique as jest.Mock).mockResolvedValue(null);

    const guard = new RolesGuard(reflector, prisma);

    const ctx = createContext({
      id: 'u1',
      permission: 'p1',
      condominium: ['condo-1'],
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new ForbiddenException('Permissão inválida.'),
    );
  });

  it('should allow when user has at least one required functionality', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['CONTRACT_TEMPLATE_READ'])
      .mockReturnValueOnce(['CONTRACT_TEMPLATE_WRITE']);

    (prisma.permissions.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      functionalities: ['CONTRACT_TEMPLATE_READ'],
    });

    const guard = new RolesGuard(reflector, prisma);

    const ctx = createContext({
      id: 'u1',
      permission: 'p1',
      condominium: ['condo-1'],
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      ctx.getClass(),
    ]);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      ctx.getHandler(),
    ]);
  });

  it('should allow when user does not have required roles but has ALL', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['X'])
      .mockReturnValueOnce([]);

    (prisma.permissions.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      functionalities: ['ALL'],
    });

    const guard = new RolesGuard(reflector, prisma);


    const ctx = createContext({
      id: 'u1',
      permission: 'p1',
      condominium: ['condo-1'],
    });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('should throw when user lacks required functionality and ALL', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(['A'])
      .mockReturnValueOnce(['B']);

    (prisma.permissions.findUnique as jest.Mock).mockResolvedValue({
      id: 'p1',
      functionalities: ['C'],
    });

    const guard = new RolesGuard(reflector, prisma);

    const ctx = createContext({
      id: 'u1',
      permission: 'p1',
      condominium: ['condo-1'],
    });

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new ForbiddenException('Você não tem acesso a esta funcionalidade.'),
    );
  });
});