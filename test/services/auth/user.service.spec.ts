import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/services/auth/user.service';
import { UserRepository } from 'src/repositories/auth/user.repository';
import { MailService } from 'src/services/tools/mail.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<UserRepository>;
  let mail: jest.Mocked<MailService>;

  const mockRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getUserPaginated: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    getByIdWithPassword: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn(),
  };

  const mockMail = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepo },
        { provide: MailService, useValue: mockMail },
      ],
    }).compile();

    service = module.get(UserService);
    repo = module.get(UserRepository);
    mail = module.get(MailService);

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call repository.getAll(condominiumId)', async () => {
      repo.getAll.mockResolvedValue([{ id: 'u1' }] as any);

      const res = await service.getAll('c1');

      expect(repo.getAll).toHaveBeenCalledWith('c1');
      expect(res).toEqual([{ id: 'u1' }]);
    });
  });

  describe('getById', () => {
    it('should call repository.getById(userId)', async () => {
      repo.getById.mockResolvedValue({ id: 'u1' } as any);

      const res = await service.getById('u1', 'c1');

      expect(repo.getById).toHaveBeenCalledWith('u1');
      expect(res).toEqual({ id: 'u1' });
    });
  });

  describe('getUserPaginated', () => {
    it('should call repository.getUserPaginated(data)', async () => {
      const page: any = { items: [], meta: { total: 0 } };
      repo.getUserPaginated.mockResolvedValue(page);

      const dto: any = { page: 1, limit: 10 };

      const res = await service.getUserPaginated(dto, 'c1');

      expect(repo.getUserPaginated).toHaveBeenCalledWith(dto);
      expect(res).toBe(page);
    });
  });

  describe('create', () => {
    it('should update existing user if already has access to condominium', async () => {
      const condominiumId = 'c1';
      const userDto: any = { email: 'a@b.com', name: 'Arthur' };

      repo.findByEmail.mockResolvedValue({
        id: 'u1',
        accesses: [{ condominium: { id: 'c1' } }],
      } as any);

      repo.update.mockResolvedValue({ id: 'u1', email: 'a@b.com' } as any);

      const res = await service.create(userDto, condominiumId);

      expect(repo.update).toHaveBeenCalledWith('u1', userDto, condominiumId);
      expect(repo.create).not.toHaveBeenCalled();
      expect(res).toEqual({ id: 'u1', email: 'a@b.com' });
    });

    it('should create user when email does not exist, hash password and send mail', async () => {
      const condominiumId = 'c1';
      const userDto: any = { email: 'a@b.com', name: 'Arthur' };

      repo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      repo.create.mockResolvedValue({ id: 'u1', email: 'a@b.com' } as any);

      const res = await service.create(userDto, condominiumId);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith(userDto, 'hashed', condominiumId);

      expect(mail.sendMail).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ id: 'u1', email: 'a@b.com' });
    });

    it('should throw HttpException when sendMail fails', async () => {
      const condominiumId = 'c1';
      const userDto: any = { email: 'a@b.com', name: 'Arthur' };

      repo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      repo.create.mockResolvedValue({ id: 'u1', email: 'a@b.com' } as any);

      mail.sendMail.mockImplementation(() => {
        throw new Error('smtp down');
      });

      await expect(service.create(userDto, condominiumId)).rejects.toMatchObject(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      );

      // garante que criou no repo antes do erro do email (como no código)
      expect(repo.create).toHaveBeenCalled();
    });

    it('should return undefined when existing user does NOT have access to condominium (current behavior)', async () => {
      // Esse teste “trava” o comportamento atual do código:
      // se existingUser existe mas não tem acesso ao condomínio, não há return.
      const condominiumId = 'c999';
      const userDto: any = { email: 'a@b.com' };

      repo.findByEmail.mockResolvedValue({
        id: 'u1',
        accesses: [{ condominium: { id: 'c1' } }],
      } as any);

      const res = await service.create(userDto, condominiumId);

      expect(repo.update).not.toHaveBeenCalled();
      expect(repo.create).not.toHaveBeenCalled();
      expect(res).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should call repository.update(userId, dto, condominiumId)', async () => {
      repo.update.mockResolvedValue({ id: 'u1' } as any);

      const res = await service.update('u1', { email: 'x' } as any, 'c1');

      expect(repo.update).toHaveBeenCalledWith('u1', { email: 'x' }, 'c1');
      expect(res).toEqual({ id: 'u1' });
    });
  });

  describe('updatePassword', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      repo.getByIdWithPassword.mockResolvedValue(null);

      await expect(
        service.updatePassword('u1', { oldPassword: 'a', newPassword: 'b' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when old password mismatch', async () => {
      repo.getByIdWithPassword.mockResolvedValue({
        id: 'u1',
        password: 'hashed',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updatePassword('u1', { oldPassword: 'wrong', newPassword: 'new' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should hash new password and update it', async () => {
      repo.getByIdWithPassword.mockResolvedValue({
        id: 'u1',
        password: 'hashed',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed');
      repo.updatePassword.mockResolvedValue({ id: 'u1' } as any);

      const res = await service.updatePassword('u1', {
        oldPassword: 'old',
        newPassword: 'new',
      } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
      expect(repo.updatePassword).toHaveBeenCalledWith('u1', 'new-hashed');
      expect(res).toEqual({ id: 'u1' });
    });
  });

  describe('delete', () => {
    it('should call repository.delete(userId, condominiumId)', async () => {
      repo.delete.mockResolvedValue({ id: 'u1' } as any);

      const res = await service.delete('u1', 'c1');

      expect(repo.delete).toHaveBeenCalledWith('u1', 'c1');
      expect(res).toEqual({ id: 'u1' });
    });
  });
});