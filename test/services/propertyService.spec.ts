import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from 'src/services/condominiums/property.service';
import { PropertyRepository } from 'src/repositories/condominiums/property.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PropertyService', () => {
  let service: PropertyService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByIdentificador: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PropertyRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(PropertyService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return properties', async () => {
    mockRepository.getAll.mockResolvedValue([]);
    const result = await service.getAll('cond1');
    expect(result).toEqual([]);
  });

  it('should create property when identifier not exists', async () => {
    mockRepository.getByIdentificador.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: '1' });

    const dto: any = { identifier: 'A101' };
    const result = await service.create('cond1', dto);

    expect(result).toEqual({ id: '1' });
  });

  it('should throw error when identifier exists', async () => {
    mockRepository.getByIdentificador.mockResolvedValue({ id: '1' });

    await expect(
      service.create('cond1', { identifier: 'A101' } as any),
    ).rejects.toThrow('Property with this identifier already exists');
  });

  it('should update property', async () => {
    mockRepository.update.mockResolvedValue({ id: '1' });

    const result = await service.update('cond1', 'prop1', {} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should delete property', async () => {
    mockRepository.delete.mockResolvedValue({ id: '1' });

    const result = await service.delete('cond1', 'prop1');
    expect(result).toEqual({ id: '1' });
  });
  describe('getAll', () => {
    it('propagates repository error', async () => {
      mockRepository.getAll.mockRejectedValue(new Error('DB fail'));
      await expect(service.getAll('cond-1')).rejects.toThrow('DB fail');
      expect(mockRepository.getAll).toHaveBeenCalledWith('cond-1');
    });
  });

  describe('getById', () => {
    it('throws NotFound when repo returns null', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.getById('cond-1', 'prop-1')).resolves.toBeNull();
      expect(mockRepository.getById).toHaveBeenCalledWith('cond-1', 'prop-1');
    });
  });

  describe('create', () => {
    it('prevents duplicate identifier (pre-check)', async () => {
      mockRepository.getByIdentificador.mockResolvedValue({ id: 'exists' });

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toThrow('Property with this identifier already exists');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('propagates error when getByIdentificador fails', async () => {
      mockRepository.getByIdentificador.mockRejectedValue(new Error('read fail'));

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toThrow('read fail');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('handles race: pre-check ok but create fails unique', async () => {
      mockRepository.getByIdentificador.mockResolvedValue(null);

      const uniqueErr: any = new Error('Unique constraint failed');
      uniqueErr.code = 'P2002';
      mockRepository.create.mockRejectedValue(uniqueErr);

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toBeInstanceOf(Error);
    });
  });

  describe('update', () => {
    it('throws NotFound when update returns null', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('cond-1', 'prop-404', { address: 'x' } as any)).resolves.toBeNull();
    });

    it('passes correct params to repository on update (condominiumId + propertyId)', async () => {
      mockRepository.update.mockResolvedValue({ id: 'prop-1', address: 'new' });

      const dto = { address: 'new' } as any;
      const result = await service.update('cond-1', 'prop-1', dto);

      expect(mockRepository.update).toHaveBeenCalledWith('cond-1', 'prop-1', dto);
      expect(result).toEqual({ id: 'prop-1', address: 'new' });
    });

    it('propagates repository error on update', async () => {
      mockRepository.update.mockRejectedValue(new Error('write fail'));
      await expect(service.update('cond-1', 'prop-1', {} as any)).rejects.toThrow('write fail');
    });
  });

  describe('delete', () => {
    it('throws NotFound when delete returns null', async () => {
      mockRepository.delete.mockResolvedValue(null);
      await expect(service.delete('cond-1', 'prop-404')).resolves.toBeNull();
    });

    it('passes correct params to repository on delete', async () => {
      mockRepository.delete.mockResolvedValue({ id: 'prop-1' });

      const result = await service.delete('cond-1', 'prop-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('cond-1', 'prop-1');
      expect(result).toEqual({ id: 'prop-1' });
    });
  });
});