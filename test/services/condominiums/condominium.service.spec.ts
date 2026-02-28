import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { UserService } from 'src/services/auth/user.service';

describe('CondominiumService', () => {
  let service: CondominiumService;
  let repo: jest.Mocked<CondominiumRepository>;
  let userService: jest.Mocked<UserService>;

  const mockRepo = {
    getByName: jest.fn(),
    create: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CondominiumService,
        { provide: CondominiumRepository, useValue: mockRepo },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get(CondominiumService);
    repo = module.get(CondominiumRepository);
    userService = module.get(UserService);
  });

  describe('create', () => {
    it('should create when name does not exist', async () => {
      repo.getByName.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: 'c1', name: 'X' } as any);

      userService.create.mockResolvedValue({ id: 'u1' } as any);

      const authUser: any = { email: 'admin@test.com', name: 'Admin' };

      const res = await service.create({ name: 'X' } as any, authUser);

      expect(repo.getByName).toHaveBeenCalledWith('X');
      expect(repo.create).toHaveBeenCalledWith({ name: 'X' });
      expect(userService.create).toHaveBeenCalledWith(
        { email: 'admin@test.com', name: 'Admin', role: 'Admin' },
        'c1',
      );
      expect(res).toEqual({ id: 'c1', name: 'X' });
    });

    it('should throw BadRequestException when name already exists', async () => {
      repo.getByName.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        service.create({ name: 'X' } as any, { email: 'x@x.com', name: 'X' } as any),
      ).rejects.toThrow(BadRequestException);

      expect(repo.create).not.toHaveBeenCalled();
      expect(userService.create).not.toHaveBeenCalled();
    });
  });
});