import { BadRequestException } from '@nestjs/common';
import { LoginValidationMiddleware } from 'src/common/middlewares/login-validation.middleware';

describe('LoginValidationMiddleware', () => {
  it('should call next for valid body', async () => {
    const mw = new LoginValidationMiddleware();
    const req: any = { body: { userLogin: 'test@test.com', password: '123' } };
    const res: any = {};
    const next = jest.fn();

    await mw.use(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should throw when userLogin is missing', async () => {
    const mw = new LoginValidationMiddleware();
    const req: any = { body: { password: '123' } };
    const res: any = {};
    const next = jest.fn();

    await expect(mw.use(req, res, next)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw when userLogin is not a string', async () => {
    const mw = new LoginValidationMiddleware();
    const req: any = { body: { userLogin: 123, password: '123' } };
    const res: any = {};
    const next = jest.fn();

    await expect(mw.use(req, res, next)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw when password is missing', async () => {
    const mw = new LoginValidationMiddleware();
    const req: any = { body: { userLogin: 'test@test.com' } };
    const res: any = {};
    const next = jest.fn();

    await expect(mw.use(req, res, next)).rejects.toBeInstanceOf(BadRequestException);
  });
});