import { BadRequestException } from '@nestjs/common';

jest.mock('class-validator', () => {
  const actual = jest.requireActual('class-validator');
  return {
    ...actual,
    validate: jest.fn(),
  };
});

import { validate } from 'class-validator';
import { LoginValidationMiddleware } from '../../src/common/middlewares/login-validation.middleware';

describe('LoginValidationMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when body is valid', async () => {
    (validate as jest.Mock).mockResolvedValue([]);

    const middleware = new LoginValidationMiddleware();
    const next = jest.fn();

    const req: any = { body: { userLogin: 'user', password: 'pass' } };

    await middleware.use(req, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException when validations exist', async () => {
    (validate as jest.Mock).mockResolvedValue([
      { constraints: { isNotEmpty: 'userLogin should not be empty' } },
      { constraints: { minLength: 'password must be longer than 6' } },
    ]);

    const middleware = new LoginValidationMiddleware();
    const req: any = { body: { userLogin: '', password: '1' } };

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(
      BadRequestException,
    );

    try {
      await middleware.use(req, {} as any, jest.fn());
    } catch (e: any) {
      expect(e.getResponse().message).toEqual([
        'userLogin should not be empty',
        'password must be longer than 6',
      ]);
    }
  });

  it('should ignore validations without constraints', async () => {
    (validate as jest.Mock).mockResolvedValue([{ constraints: undefined }]);

    const middleware = new LoginValidationMiddleware();
    const req: any = { body: { userLogin: '', password: '' } };

    await expect(middleware.use(req, {} as any, jest.fn())).rejects.toThrow(
      BadRequestException,
    );

    try {
      await middleware.use(req, {} as any, jest.fn());
    } catch (e: any) {
      expect(e.getResponse().message).toEqual([]);
    }
  });
});