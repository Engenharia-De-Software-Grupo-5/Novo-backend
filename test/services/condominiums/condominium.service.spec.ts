import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { UserService } from 'src/services/auth/user.service';

describe('CondominiumService', () => {
  let service: CondominiumService;
  let repo: jest.Mocked<CondominiumRepository>;
  let users: jest.Mocked<UserService>;

  const mockRepo = {
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getById: jest.fn(),
    getByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CondominiumService,
        { provide: CondominiumRepository, useValue: mockRepo },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get(CondominiumService);
    repo = module.get(CondominiumRepository);
    users = module.get(UserService);

    jest.clearAllMocks();
  });

  it('getAll should call repository.getAll', async () => {
    repo.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.getAll();

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getPaginated should call repository.getPaginated', async () => {
    repo.getPaginated.mockResolvedValue({ items: [], meta: { page: 1 } } as any);

    const res = await service.getPaginated({ page: 1, limit: 10 } as any);

    expect(repo.getPaginated).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(res).toEqual({ items: [], meta: { page: 1 } });
  });

  it('getById should call repository.getById(condominiumId)', async () => {
    repo.getById.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.getById('c1');

    expect(repo.getById).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  describe('create', () => {
    it('should create condominium and also create an Admin user for it', async () => {
      repo.getByName.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: 'c1', name: 'X' } as any);
      users.create.mockResolvedValue({ id: 'u1' } as any);

      const res = await service.create(
        { name: 'X' } as any,
        { email: 'a@a.com', name: 'Arthur' } as any,
      );

      expect(repo.getByName).toHaveBeenCalledWith('X');
      expect(repo.create).toHaveBeenCalledWith({ name: 'X' });
      expect(users.create).toHaveBeenCalledWith(
        { email: 'a@a.com', name: 'Arthur', role: 'Admin' },
        'c1',
      );
      expect(res).toEqual({ id: 'c1', name: 'X' });
    });

    it('should throw BadRequestException when condominium name already exists', async () => {
      repo.getByName.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        service.create({ name: 'X' } as any, { email: 'a@a.com', name: 'Arthur' } as any),
      ).rejects.toThrow(BadRequestException);

      expect(repo.create).not.toHaveBeenCalled();
      expect(users.create).not.toHaveBeenCalled();
    });
  });

  it('update should call repository.update(id, dto)', async () => {
    repo.update.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.update('c1', { name: 'Y' } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', { name: 'Y' });
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should call repository.delete(condominiumId)', async () => {
    repo.delete.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.delete('c1');

    expect(repo.delete).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });
});