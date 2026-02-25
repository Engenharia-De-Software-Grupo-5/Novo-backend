import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TenantService } from 'src/services/tenants/tenant.service';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

describe('TenantService', () => {
  let service: TenantService;
  let repo: jest.Mocked<TenantRepository>;

  const mockRepo = {
    getAll: jest.fn(),
    getByCpf: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteByCpf: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: TenantRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(TenantService);
    repo = module.get(TenantRepository);

    jest.clearAllMocks();
  });

  it('getAll should call repo.getAll()', async () => {
    repo.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await service.getAll();

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 't1' }]);
  });

  describe('getByCpf', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      repo.getByCpf.mockResolvedValue(null);

      await expect(service.getByCpf('123')).rejects.toThrow(NotFoundException);
    });

    it('should return tenant when found', async () => {
      repo.getByCpf.mockResolvedValue({ id: 't1', cpf: '123' } as any);

      const res = await service.getByCpf('123');

      expect(repo.getByCpf).toHaveBeenCalledWith('123');
      expect(res).toEqual({ id: 't1', cpf: '123' });
    });
  });

  describe('getById', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      repo.getById.mockResolvedValue(null);

      await expect(service.getById('t1')).rejects.toThrow(NotFoundException);
    });

    it('should return tenant when found', async () => {
      repo.getById.mockResolvedValue({ id: 't1' } as any);

      const res = await service.getById('t1');

      expect(repo.getById).toHaveBeenCalledWith('t1');
      expect(res).toEqual({ id: 't1' });
    });
  });

  describe('create', () => {
    it('should throw BadRequestException when CPF already exists', async () => {
      repo.getByCpf.mockResolvedValue({ id: 'existing' } as any);

      await expect(
        service.create({ cpf: '123' } as any),
      ).rejects.toThrow(BadRequestException);

      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should create when CPF does not exist', async () => {
      repo.getByCpf.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: 't1' } as any);

      const res = await service.create({ cpf: '123', name: 'A' } as any);

      expect(repo.create).toHaveBeenCalledWith({ cpf: '123', name: 'A' });
      expect(res).toEqual({ id: 't1' });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      repo.getById.mockResolvedValue(null);

      await expect(service.update('t1', { name: 'X' } as any)).rejects.toThrow(
        NotFoundException,
      );

      expect(repo.update).not.toHaveBeenCalled();
    });

    it('should update when tenant exists', async () => {
      repo.getById.mockResolvedValue({ id: 't1' } as any);
      repo.update.mockResolvedValue({ id: 't1', name: 'X' } as any);

      const res = await service.update('t1', { name: 'X' } as any);

      expect(repo.update).toHaveBeenCalledWith('t1', { name: 'X' });
      expect(res).toEqual({ id: 't1', name: 'X' });
    });
  });

  describe('deleteByCpf', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      repo.getByCpf.mockResolvedValue(null);

      await expect(service.deleteByCpf('123')).rejects.toThrow(NotFoundException);

      expect(repo.deleteByCpf).not.toHaveBeenCalled();
    });

    it('should delete when tenant exists', async () => {
      repo.getByCpf.mockResolvedValue({ id: 't1' } as any);
      repo.deleteByCpf.mockResolvedValue({ id: 't1' } as any);

      const res = await service.deleteByCpf('123');

      expect(repo.deleteByCpf).toHaveBeenCalledWith('123');
      expect(res).toEqual({ id: 't1' });
    });
  });

  describe('deleteById', () => {
    it('should throw NotFoundException when tenant not found', async () => {
      repo.getById.mockResolvedValue(null);

      await expect(service.deleteById('t1')).rejects.toThrow(NotFoundException);

      expect(repo.deleteById).not.toHaveBeenCalled();
    });

    it('should delete when tenant exists', async () => {
      repo.getById.mockResolvedValue({ id: 't1' } as any);
      repo.deleteById.mockResolvedValue({ id: 't1' } as any);

      const res = await service.deleteById('t1');

      expect(repo.deleteById).toHaveBeenCalledWith('t1');
      expect(res).toEqual({ id: 't1' });
    });
  });
});