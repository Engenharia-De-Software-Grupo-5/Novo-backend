import { UnauthorizedException } from '@nestjs/common';

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

import { LocalAuthGuard } from '../../src/common/guards/local-auth.guard';

describe('LocalAuthGuard', () => {
  const createContext = () => ({}) as any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate canActivate to super.canActivate', () => {
    const guard = new LocalAuthGuard() as any;
    guard.mockCanActivate.mockReturnValue(true);

    const ctx = createContext();
    const result = guard.canActivate(ctx);

    expect(guard.mockCanActivate).toHaveBeenCalledWith(ctx);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when err exists', () => {
    const guard = new LocalAuthGuard();

    expect(() => guard.handleRequest(new Error('bad'), null)).toThrow(
      new UnauthorizedException('bad'),
    );
  });

  it('should throw UnauthorizedException when user is missing', () => {
    const guard = new LocalAuthGuard();

    expect(() => guard.handleRequest(null, null)).toThrow(UnauthorizedException);
  });

  it('should return user when authentication succeeds', () => {
    const guard = new LocalAuthGuard();
    const user = { id: '1' };

    expect(guard.handleRequest(null, user)).toBe(user);
  });
});