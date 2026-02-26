import { LocalStrategy } from 'src/common/guards/strategies/local.strategy';

describe('LocalStrategy', () => {
  it('should call authService.validateUser and return result', async () => {
    const authService = {
      validateUser: jest.fn().mockResolvedValue({ id: '1', email: 'a@a.com' }),
    };

    const strategy = new LocalStrategy(authService as any);

    await expect(strategy.validate('a@a.com', '123')).resolves.toEqual({
      id: '1',
      email: 'a@a.com',
    });

    expect(authService.validateUser).toHaveBeenCalledWith('a@a.com', '123');
  });
});