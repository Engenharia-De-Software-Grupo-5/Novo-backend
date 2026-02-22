describe('JwtStrategy', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jest.resetModules();
  });

  it('should return payload in validate', async () => {
    const { JwtStrategy } = await import('../../src/common/guards/strategies/jwt.strategy');

    const strategy = new JwtStrategy();
    const payload: any = { sub: '1', permission: 'p1' };

    await expect(strategy.validate(payload)).resolves.toEqual(payload);
  });
});