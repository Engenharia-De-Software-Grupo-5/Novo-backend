import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be constructible', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeDefined();
  });

  it('should have canActivate function inherited from AuthGuard', () => {
    const guard: any = new LocalAuthGuard();
    expect(typeof guard.canActivate).toBe('function');
  });
});