import { JwtStrategy } from 'src/common/guards/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should validate and return payload', async () => {
    const strategy = new JwtStrategy();
    const payload: any = { sub: 'user-id', email: 'a@a.com' };

    await expect(strategy.validate(payload)).resolves.toEqual(payload);
  });
});