describe('CurrentUser decorator', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return request.user from http context', async () => {
    jest.doMock('@nestjs/common', () => {
      const actual = jest.requireActual('@nestjs/common');
      return {
        ...actual,
        createParamDecorator: (factory: any) => ({ factory }),
      };
    });

    const { CurrentUser } = await import('src/common/decorators/current.user.decorator');

    const user = { id: 'u1' };
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;

    const res = (CurrentUser as any).factory(undefined, ctx);
    expect(res).toEqual(user);
  });

  it('should return undefined when request has no user', async () => {
    jest.doMock('@nestjs/common', () => {
      const actual = jest.requireActual('@nestjs/common');
      return {
        ...actual,
        createParamDecorator: (factory: any) => ({ factory }),
      };
    });

    const { CurrentUser } = await import('src/common/decorators/current.user.decorator');

    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as any;

    const res = (CurrentUser as any).factory(undefined, ctx);
    expect(res).toBeUndefined();
  });
});