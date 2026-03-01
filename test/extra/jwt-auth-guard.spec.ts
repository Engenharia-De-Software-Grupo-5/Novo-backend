import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  const makeCtx = () =>
    ({
      getHandler: () => function handler() {},
      getClass: () => class DummyClass {},
    }) as any;

  const load = () => {
    jest.resetModules();

    // Mock antes do import do JwtAuthGuard
    jest.doMock('@nestjs/passport', () => ({
      AuthGuard: () =>
        class PassportAuthGuardMock {
          canActivate() {
            return true;
          }
        },
    }));

    let JwtAuthGuard: any;
    let IS_PUBLIC_KEY: any;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      JwtAuthGuard = require('src/common/guards/jwt-auth.guard').JwtAuthGuard;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      IS_PUBLIC_KEY = require('src/common/decorators').IS_PUBLIC_KEY;
    });

    return { JwtAuthGuard, IS_PUBLIC_KEY };
  };

  it('should bypass auth when route is public', () => {
    const { JwtAuthGuard, IS_PUBLIC_KEY } = load();

    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as unknown as Reflector;

    const guard = new JwtAuthGuard(reflector);

    expect(guard.canActivate(makeCtx())).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  it('should return boolean when super.canActivate returns boolean', () => {
    const { JwtAuthGuard } = load();

    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    const guard = new JwtAuthGuard(reflector);

    const superProto = Object.getPrototypeOf(Object.getPrototypeOf(guard));
    jest.spyOn(superProto, 'canActivate').mockReturnValue(true);

    expect(guard.canActivate(makeCtx())).toBe(true);
  });

  it('should throw UnauthorizedException(message) when super promise rejects with Error', async () => {
    const { JwtAuthGuard } = load();

    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    const guard = new JwtAuthGuard(reflector);

    const superProto = Object.getPrototypeOf(Object.getPrototypeOf(guard));
    jest
      .spyOn(superProto, 'canActivate')
      .mockReturnValue(Promise.reject(new Error('token expired')));

    await expect(guard.canActivate(makeCtx()) as Promise<boolean>).rejects.toMatchObject({
      name: 'UnauthorizedException',
      message: 'token expired',
    });
  });

  it('should throw UnauthorizedException() when super promise rejects with non-Error', async () => {
    const { JwtAuthGuard } = load();

    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;

    const guard = new JwtAuthGuard(reflector);

    const superProto = Object.getPrototypeOf(Object.getPrototypeOf(guard));
    jest.spyOn(superProto, 'canActivate').mockReturnValue(Promise.reject('boom'));

    // NÃO use toThrow(UnauthorizedException) aqui (construtores duplicados).
    // Valide por "name" e/ou "message".
    await expect(guard.canActivate(makeCtx()) as Promise<boolean>).rejects.toMatchObject({
      name: 'UnauthorizedException',
      message: 'Unauthorized',
    });
  });
});