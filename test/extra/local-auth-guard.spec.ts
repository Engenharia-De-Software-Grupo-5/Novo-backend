import { ExecutionContext } from '@nestjs/common';

describe('LocalAuthGuard', () => {
  const makeCtx = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    }) as any;

  const load = () => {
    jest.resetModules();

    // Mocka o AuthGuard ANTES de importar o LocalAuthGuard
    jest.doMock('@nestjs/passport', () => ({
      AuthGuard: () =>
        class PassportAuthGuardMock {
          canActivate() {
            return true;
          }
        },
    }));

    let LocalAuthGuard: any;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      LocalAuthGuard = require('src/common/guards/local-auth.guard').LocalAuthGuard;
    });

    return { LocalAuthGuard };
  };

  it('canActivate should delegate to super.canActivate', () => {
    const { LocalAuthGuard } = load();

    const guard = new LocalAuthGuard();

    const superProto = Object.getPrototypeOf(Object.getPrototypeOf(guard));
    const spy = jest.spyOn(superProto, 'canActivate').mockReturnValue(false);

    const res = guard.canActivate(makeCtx());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(res).toBe(false);
  });

  it('handleRequest should throw UnauthorizedException with message when err exists', () => {
    const { LocalAuthGuard } = load();
    const guard = new LocalAuthGuard();

    expect(() => guard.handleRequest(new Error('bad'), { id: 'u1' })).toThrow('bad');

    try {
      guard.handleRequest(new Error('bad'), { id: 'u1' });
    } catch (e: any) {
      expect(e).toMatchObject({ name: 'UnauthorizedException', message: 'bad' });
    }
  });

  it('handleRequest should throw UnauthorizedException when user is missing', () => {
    const { LocalAuthGuard } = load();
    const guard = new LocalAuthGuard();

    expect(() => guard.handleRequest(null, null)).toThrow('Unauthorized');

    try {
      guard.handleRequest(null, null);
    } catch (e: any) {
      expect(e).toMatchObject({ name: 'UnauthorizedException', message: 'Unauthorized' });
    }
  });

  it('handleRequest should return user when ok', () => {
    const { LocalAuthGuard } = load();
    const guard = new LocalAuthGuard();
    const user = { id: 'u1' };

    expect(guard.handleRequest(null, user)).toBe(user);
  });
});