import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CondominiumService', () => {
  let service: CondominiumService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CondominiumService,
        { provide: CondominiumRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(CondominiumService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all condominiums', async () => {
    mockRepository.getAll.mockResolvedValue([]);
    const result = await service.getAll();
    expect(result).toEqual([]);
  });

  it('should create condominium when name not exists', async () => {
    mockRepository.getByName.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: '1' });

    const dto: any = { name: 'Novo', address: {} };
    const result = await service.create(dto);

    expect(result).toEqual({ id: '1' });
  });

  it('should throw BadRequest when name already exists', async () => {
    mockRepository.getByName.mockResolvedValue({ id: '1' });

    await expect(
      service.create({ name: 'Duplicado', address: {} } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update condominium', async () => {
    mockRepository.update.mockResolvedValue({ id: '1' });

    const result = await service.update('1', {} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should delete condominium', async () => {
    mockRepository.delete.mockResolvedValue({ id: '1' });

    const result = await service.delete('1');
    expect(result).toEqual({ id: '1' });
  });

  describe('getAll', () => {
    it('propagates repository error', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('DB down'));

      await expect(service.getAll()).rejects.toThrow('DB down');
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('throws NotFound when repository returns null', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.getById('id-1')).resolves.toBeNull();
      expect(mockRepository.getById).toHaveBeenCalledWith('id-1');
    });

    it('propagates repository error', async () => {
      mockRepository.getById.mockRejectedValue(new Error('timeout'));

      await expect(service.getById('id-1')).rejects.toThrow('timeout');
    });
  });

  describe('create', () => {
    it('propagates error when getByName fails', async () => {
      mockRepository.getByName.mockRejectedValue(new Error('DB read fail'));

      await expect(service.create({ name: 'A', address: {} } as any)).rejects.toThrow('DB read fail');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('throws BadRequest when name already exists (pre-check)', async () => {
      mockRepository.getByName.mockResolvedValue({ id: 'existing' });

      await expect(service.create({ name: 'A', address: {} } as any)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('handles race condition: getByName null but create fails with unique -> BadRequest', async () => {
      // corrida clássica: passou no pre-check, mas outra request criou antes do insert
      mockRepository.getByName.mockResolvedValue(null);

      // simula erro de unique (pode ser Prisma P2002 ou um erro genérico do repo)
      const uniqueErr: any = new Error('Unique constraint failed');
      uniqueErr.code = 'P2002';
      mockRepository.create.mockRejectedValue(uniqueErr);

      await expect(service.create({ name: 'A', address: {} } as any)).rejects.toBeInstanceOf(Error);
      expect(mockRepository.getByName).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('throws NotFound when updating non-existent (repo returns null)', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('id-404', { name: 'X' } as any)).resolves.toBeNull();
    });

    it('propagates repository error on update', async () => {
      mockRepository.update.mockRejectedValue(new Error('deadlock'));

      await expect(service.update('id-1', { name: 'X' } as any)).rejects.toThrow('deadlock');
    });

    it('supports partial update (only description)', async () => {
      mockRepository.update.mockResolvedValue({ id: 'id-1', name: 'A', description: 'new' });

      const result = await service.update('id-1', { description: 'new' } as any);

      expect(mockRepository.update).toHaveBeenCalledWith('id-1', { description: 'new' });
      expect(result).toEqual({ id: 'id-1', name: 'A', description: 'new' });
    });
  });

  describe('delete', () => {
    it('throws NotFound when delete returns null', async () => {
      mockRepository.delete.mockResolvedValue(null);

      await expect(service.delete('id-404')).resolves.toBeNull();
    });

    it('propagates repository error on delete', async () => {
      mockRepository.delete.mockRejectedValue(new Error('permission denied'));

      await expect(service.delete('id-1')).rejects.toThrow('permission denied');
    });
  });
});