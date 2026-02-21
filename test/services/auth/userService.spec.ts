import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthRepository } from 'src/repositories/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<AuthRepository>;
  let jwt: jest.Mocked<JwtService>;

  const mockRepo = (): jest.Mocked<AuthRepository> =>
    ({
      getUserByEmailOrCpf: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUserPassword: jest.fn(),
    }) as any;

  const mockJwt = (): jest.Mocked<JwtService> =>
    ({
      sign: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useFactory: mockRepo },
        { provide: JwtService, useFactory: mockJwt },
      ],
    }).compile();

    service = module.get(AuthService);
    repo = module.get(AuthRepository);
    jwt = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  it('passwordResetEmail should generate password, hash it, update user password and return new password', async () => {
    repo.getUserByEmail.mockResolvedValue({ id: 'u-1', email: 'a@a.com' } as any);

    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-pass' as any);

    repo.updateUserPassword.mockResolvedValue(undefined as any);

    const newPassword = await service.passwordResetEmail('a@a.com');

    expect(repo.getUserByEmail).toHaveBeenCalledWith('a@a.com');
    expect(repo.updateUserPassword).toHaveBeenCalledWith(
      { id: 'u-1', email: 'a@a.com' },
      'hashed-pass',
    );

    expect(typeof newPassword).toBe('string');
    expect(newPassword.length).toBe(8);
  });

  it('passwordResetEmail should throw UnauthorizedException when user not found', async () => {
    repo.getUserByEmail.mockResolvedValue(null);

    await expect(service.passwordResetEmail('x@y.com')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(repo.updateUserPassword).not.toHaveBeenCalled();
  });
});