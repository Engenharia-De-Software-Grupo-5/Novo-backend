import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const makeService = () => {
    const authRepository = {
      getUserByEmail: jest.fn(),
      getUserIdByEmail: jest.fn(),
      updateUserPassword: jest.fn(),
    };

    const jwtService = {
      sign: jest.fn(),
    };

    const service = new AuthService(authRepository as any, jwtService as any);

    return { service, authRepository, jwtService };
  };

  describe('validateUser', () => {
    it('should return user (with password undefined) if password matches', async () => {
      const { service, authRepository } = makeService();

      const userFromRepo = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed',
        name: 'Test',
        isAdminMaster: false,
        accesses: [],
      };

      authRepository.getUserByEmail.mockResolvedValue(userFromRepo);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', '123');

      expect(authRepository.getUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed');

      expect(result).toEqual({
        ...userFromRepo,
        password: undefined,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const { service, authRepository } = makeService();

      authRepository.getUserByEmail.mockResolvedValue(null);

      await expect(service.validateUser('test@test.com', '123')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const { service, authRepository } = makeService();

      const userFromRepo = {
        id: '1',
        email: 'test@test.com',
        password: 'hashed',
        name: 'Test',
        isAdminMaster: true,
        accesses: [],
      };

      authRepository.getUserByEmail.mockResolvedValue(userFromRepo);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@test.com', 'wrong')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should sign payload correctly and return access_token + name', () => {
      const { service, jwtService } = makeService();

      jwtService.sign.mockReturnValue('jwt-token');

      const user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        isAdminMaster: true,
        accesses: [
          { permission: { id: 'p1', name: 'ADMIN' }, condominium: { id: 'c1', name: 'C1' } },
          { permission: { id: 'p2', name: 'MANAGER' }, condominium: { id: 'c2', name: 'C2' } },
        ],
      };

      const result = service.login(user as any);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        name: user.name,
        isAdminMaster: user.isAdminMaster,
        permission: user.accesses.map((a) => a.permission),
        condominium: user.accesses.map((a) => a.condominium),
      });

      expect(result).toEqual({
        access_token: 'jwt-token',
        name: 'Test User',
      });
    });
  });
});