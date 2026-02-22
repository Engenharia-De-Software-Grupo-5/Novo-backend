import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: () => {
      return class {
        public mockCanActivate = jest.fn();
        canActivate(context: any) {
          return this.mockCanActivate(context);
        }
      };
    },
  };
});

import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../../src/common/decorators';

describe('JwtAuthGuard', () => {
  let reflector: Reflector;

  const createContext = () =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
    }) as any;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access when route is public', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);

    const guard = new JwtAuthGuard(reflector) as any;
    const ctx = createContext();

    const result = guard.canActivate(ctx);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    expect(result).toBe(true);
    expect(guard.mockCanActivate).not.toHaveBeenCalled();
  });

  it('should return boolean when super.canActivate returns boolean', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const guard = new JwtAuthGuard(reflector) as any;
    guard.mockCanActivate.mockReturnValue(true);

    const ctx = createContext();
    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(guard.mockCanActivate).toHaveBeenCalledWith(ctx);
  });

  it('should wrap promise rejection into UnauthorizedException with message', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const guard = new JwtAuthGuard(reflector) as any;
    guard.mockCanActivate.mockReturnValue(
      Promise.reject(new Error('invalid token')),
    );

    const ctx = createContext();

    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('invalid token'),
    );
  });

  it('should wrap non-Error promise rejection into generic UnauthorizedException', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const guard = new JwtAuthGuard(reflector) as any;
    guard.mockCanActivate.mockReturnValue(Promise.reject('nope'));

    const ctx = createContext();

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});