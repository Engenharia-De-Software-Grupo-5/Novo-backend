import { LocalStrategy } from '../../src/common/guards/strategies/local.strategy';

describe('LocalStrategy', () => {
  it('should call AuthService.validateUser with userLogin and password', async () => {
    const authService = {
      validateUser: jest.fn().mockResolvedValue({ id: '1' }),
    } as any;

    const strategy = new LocalStrategy(authService);

    const result = await strategy.validate('login', 'pass');

    expect(authService.validateUser).toHaveBeenCalledWith('login', 'pass');
    expect(result).toEqual({ id: '1' });
  });
});