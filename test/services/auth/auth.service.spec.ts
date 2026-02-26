import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const makeService = () => {
    const authRepository = {
      getUserByEmailOrCpf: jest.fn(),
    };

    const jwtService = {
      sign: jest.fn(),
      signAsync: jest.fn(),
    };

    const service = new AuthService(authRepository as any, jwtService as any);

    return { service, authRepository, jwtService };
  };

  describe('validateUser', () => {
    it('should return user (without password) if password matches', async () => {
      const { service, authRepository } = makeService();

      const userFromRepo = {
        id: '1',
        email: 'test@test.com',
        cpf: '12345678900',
        password: 'hashed',
        name: 'Test',
        accesses: [],
      };

      authRepository.getUserByEmailOrCpf.mockResolvedValue(userFromRepo);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', '123');

      expect(authRepository.getUserByEmailOrCpf).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed');

      expect(result).toEqual({
        id: '1',
        email: 'test@test.com',
        cpf: '12345678900',
        name: 'Test',
        accesses: [],
      });
    });

    it('should normalize cpf (remove . and -) before calling repository', async () => {
      const { service, authRepository } = makeService();

      authRepository.getUserByEmailOrCpf.mockResolvedValue(null);

      await expect(service.validateUser('123.456.789-00', '123')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      expect(authRepository.getUserByEmailOrCpf).toHaveBeenCalledWith('12345678900');
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const { service, authRepository } = makeService();

      authRepository.getUserByEmailOrCpf.mockResolvedValue(null);

      await expect(service.validateUser('test@test.com', '123')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const { service, authRepository } = makeService();

      const userFromRepo = {
        id: '1',
        email: 'test@test.com',
        cpf: '12345678900',
        password: 'hashed',
        name: 'Test',
        accesses: [],
      };

      authRepository.getUserByEmailOrCpf.mockResolvedValue(userFromRepo);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@test.com', 'wrong')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should sign payload correctly and return access_token', async () => {
      const { service, jwtService } = makeService();

      jwtService.sign.mockReturnValue('jwt-token');

      const user = {
        id: '1',
        email: 'test@test.com',
        cpf: '12345678900',
        name: 'Test User',
        accesses: [
          { permission: { id: 'p1', name: 'ADMIN' }, condominium: { id: 'c1', name: 'C1' } },
          { permission: { id: 'p2', name: 'MANAGER' }, condominium: { id: 'c2', name: 'C2' } },
        ],
      };

      const result: any = await service.login(user as any);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        cpf: user.cpf,
        name: user.name,
        permission: user.accesses.map((a) => a.permission),
        condominium: user.accesses.map((a) => a.condominium),
      });

  
      expect(result).toEqual(
        expect.objectContaining({
          access_token: 'jwt-token',
        }),
      );

   
      expect(result.name).toBe('Test User');

 
      expect(result.user).toBeUndefined();
    });
  });
});