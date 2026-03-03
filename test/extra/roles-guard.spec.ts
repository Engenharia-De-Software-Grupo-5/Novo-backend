import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ROLES_KEY } from 'src/common/decorators';

describe('RolesGuard', () => {
  const makeCtx = (user?: any): ExecutionContext =>
    ({
      getClass: () => class DummyClass {},
      getHandler: () => function handler() {},
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as any;

  it('should allow when no roles are required', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector, {} as any);

    await expect(guard.canActivate(makeCtx({ condominium: [{}] }))).resolves.toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [expect.any(Function)]);
  });

  it('should throw when roles are required and user is missing', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector, {} as any);

    await expect(guard.canActivate(makeCtx(undefined))).rejects.toThrow(
      new ForbiddenException('Token inválido.'),
    );
  });

  it('should throw when roles are required and user has no condominium permissions', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector, {} as any);

    await expect(guard.canActivate(makeCtx({ condominium: [] }))).rejects.toThrow(
      new ForbiddenException('Token sem permissão definida.'),
    );
  });

  it('should allow when roles are required and user has condominium permissions', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as unknown as Reflector;

    const guard = new RolesGuard(reflector, {} as any);

    await expect(guard.canActivate(makeCtx({ condominium: [{ id: 'c1' }] }))).resolves.toBe(true);
  });
});