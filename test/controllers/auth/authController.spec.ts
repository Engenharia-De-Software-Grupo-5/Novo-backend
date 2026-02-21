import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { MailService } from 'src/services/tools/mail.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mailService: { sendMail: jest.Mock };

  const createAuthServiceMock = (): jest.Mocked<AuthService> =>
    ({
      validateUser: jest.fn(),
      login: jest.fn(),
      passwordResetEmail: jest.fn(),
    }) as any;

  beforeEach(async () => {
    authService = createAuthServiceMock();
    mailService = { sendMail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send reset password email and return void', async () => {
    authService.passwordResetEmail.mockResolvedValue('abcd1234');

    const dto = { email: 'user@example.com' };

    const result = await controller.passwordResetEmail(dto as any);

    expect(authService.passwordResetEmail).toHaveBeenCalledWith('user@example.com');

    expect(mailService.sendMail).toHaveBeenCalledWith(
      'user@example.com',
      'Password Reset',
      'Your new password is: abcd1234',
    );

    expect(result).toBeUndefined();
  });

  it('should throw HttpException(401) when user not found', async () => {
    authService.passwordResetEmail.mockRejectedValue(new Error());

    await expect(
      controller.passwordResetEmail({ email: 'user@example.com' } as any),
    ).rejects.toBeInstanceOf(HttpException);

    await expect(
      controller.passwordResetEmail({ email: 'user@example.com' } as any),
    ).rejects.toMatchObject({
      message: 'User not found.',
      status: HttpStatus.UNAUTHORIZED,
    });

    expect(mailService.sendMail).not.toHaveBeenCalled();
  });
});