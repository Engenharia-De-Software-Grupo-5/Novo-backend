import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthController } from 'src/controllers/auth/auth.controller';
import { AuthService } from 'src/services/auth/auth.service';
import { MailService } from 'src/services/tools/mail.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mailService: jest.Mocked<MailService>;

  const mockAuthService = {
    login: jest.fn(),
    passwordResetEmail: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
    mailService = module.get(MailService);
  });

  it('login should call authService.login(req.user)', () => {
    authService.login.mockReturnValue({ access_token: 't', name: 'Arthur' } as any);

    const req: any = { user: { id: 'u1' } };
    const res = controller.login(req);

    expect(authService.login).toHaveBeenCalledWith(req.user);
    expect(res).toEqual({ access_token: 't', name: 'Arthur' });
  });

  describe('passwordResetEmail', () => {
    it('should call authService.passwordResetEmail and mailService.sendMail', async () => {
      authService.passwordResetEmail.mockResolvedValue('NEWPASS');

      await controller.passwordResetEmail({ email: 'a@b.com' } as any);

      expect(authService.passwordResetEmail).toHaveBeenCalledWith('a@b.com');
      expect(mailService.sendMail).toHaveBeenCalledWith(
        'a@b.com',
        'Password Reset',
        expect.stringContaining('NEWPASS'),
      );
    });

    it('should throw HttpException(401) when authService fails', async () => {
      authService.passwordResetEmail.mockRejectedValue(new Error('not found'));

      await expect(
        controller.passwordResetEmail({ email: 'a@b.com' } as any),
      ).rejects.toBeInstanceOf(HttpException);

      await expect(
        controller.passwordResetEmail({ email: 'a@b.com' } as any),
      ).rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED });

      expect(mailService.sendMail).not.toHaveBeenCalled();
    });
  });
});