import { UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(() => {
    guard = new LocalAuthGuard();
  });

  it('should throw UnauthorizedException when err exists', () => {
    expect(() =>
      guard.handleRequest(new Error('bad'), { id: 'u1' }),
    ).toThrow(UnauthorizedException);

    expect(() =>
      guard.handleRequest(new Error('bad'), { id: 'u1' }),
    ).toThrow('bad');
  });

  it('should throw UnauthorizedException when user is null', () => {
    expect(() =>
      guard.handleRequest(null, null),
    ).toThrow(UnauthorizedException);
  });

  it('should return user when valid', () => {
    const user = { id: 'u1' };

    const result = guard.handleRequest(null, user);

    expect(result).toEqual(user);
  });
});