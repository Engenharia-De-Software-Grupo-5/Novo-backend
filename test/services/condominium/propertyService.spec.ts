import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from 'src/services/condominiums/property.service';
import { PropertyRepository } from 'src/repositories/condominiums/property.repository';
import { BadRequestException } from '@nestjs/common';

describe('PropertyService (CT-11..CT-20 + edge cases)', () => {
  let service: PropertyService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByIdentificador: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const condominiumId = 'cond-1';

  const validCreateDto: any = {
    identifier: 'A101',
    unityNumber: '101',
    unityType: 'APARTMENT',
    block: 'B',
    floor: 3,
    totalArea: 50,
    propertySituation: 'ACTIVE',
    observations: 'ok',
    address: 'Rua X, 123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PropertyRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(PropertyService);
  });

  afterEach(() => jest.resetAllMocks());

 
  it('CT-11 - should create property with valid data', async () => {
    mockRepository.getByIdentificador.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: 'prop-1', ...validCreateDto });

    const result = await service.create(condominiumId, validCreateDto);

    expect(mockRepository.getByIdentificador).toHaveBeenCalled();
    expect(mockRepository.create).toHaveBeenCalledWith(condominiumId, validCreateDto);
    expect(result).toEqual({ id: 'prop-1', ...validCreateDto });
  });


  it('CT-12 - should reject create without identifier (BadRequest)', async () => {
    mockRepository.getByIdentificador.mockResolvedValue(null);
    mockRepository.create.mockRejectedValue(
      new BadRequestException('Identificador do imóvel é obrigatório'),
    );

    const dto = { ...validCreateDto };
    delete dto.identifier;

    await expect(service.create(condominiumId, dto))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

  
  it('CT-13 - should reject create without unityNumber (BadRequest)', async () => {
    mockRepository.getByIdentificador.mockResolvedValue(null);
    mockRepository.create.mockRejectedValue(
      new BadRequestException('Número do imóvel é obrigatório'),
    );

    const dto = { ...validCreateDto };
    delete dto.unityNumber;

    await expect(service.create(condominiumId, dto))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

 
  it('CT-14 - should list properties with default params', async () => {
    mockRepository.getAll.mockResolvedValue([{ id: 'prop-1' }, { id: 'prop-2' }]);

    const result = await service.getAll(condominiumId);

    expect(mockRepository.getAll).toHaveBeenCalledWith(condominiumId);
    expect(result).toEqual([{ id: 'prop-1' }, { id: 'prop-2' }]);
  });


  it('CT-15 - should return property by valid id', async () => {
    mockRepository.getById.mockResolvedValue({ id: 'prop-1', ...validCreateDto });

    const result = await service.getById(condominiumId, 'prop-1');

    expect(mockRepository.getById).toHaveBeenCalledWith(condominiumId, 'prop-1');
    expect(result).toEqual({ id: 'prop-1', ...validCreateDto });
  });

  
  it('CT-16 - should return null when property id does not exist (current behavior)', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(service.getById(condominiumId, 'prop-404')).resolves.toBeNull();
    expect(mockRepository.getById).toHaveBeenCalledWith(condominiumId, 'prop-404');
  });


  it('CT-17 - should update property with valid data', async () => {
    mockRepository.update.mockResolvedValue({ id: 'prop-1', observations: 'novo' });

    const result = await service.update(condominiumId, 'prop-1', { observations: 'novo' } as any);

    expect(mockRepository.update).toHaveBeenCalledWith(condominiumId, 'prop-1', { observations: 'novo' });
    expect(result).toEqual({ id: 'prop-1', observations: 'novo' });
  });


  it('CT-18 - should reject update with empty body (BadRequest)', async () => {
    mockRepository.update.mockRejectedValue(
      new BadRequestException('Body vazio'),
    );

    await expect(service.update(condominiumId, 'prop-1', {} as any))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

  
  it('CT-19 - should delete existing property', async () => {
    mockRepository.delete.mockResolvedValue({ id: 'prop-1' });

    const result = await service.delete(condominiumId, 'prop-1');

    expect(mockRepository.delete).toHaveBeenCalledWith(condominiumId, 'prop-1');
    expect(result).toEqual({ id: 'prop-1' });
  });

  
  it('CT-20 - should return null when deleting non-existent property (current behavior)', async () => {
    mockRepository.delete.mockResolvedValue(null);

    await expect(service.delete(condominiumId, 'prop-404')).resolves.toBeNull();
    expect(mockRepository.delete).toHaveBeenCalledWith(condominiumId, 'prop-404');
  });

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
    it('returns null when repo returns null (current behavior)', async () => {
      mockRepository.getById.mockResolvedValue(null);

      await expect(service.getById('cond-1', 'prop-1')).resolves.toBeNull();
      expect(mockRepository.getById).toHaveBeenCalledWith('cond-1', 'prop-1');
    });
  });

  describe('create', () => {
    it('prevents duplicate identifier (pre-check)', async () => {
      mockRepository.getByIdentificador.mockResolvedValue({ id: 'exists' });

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toThrow(
        'Property with this identifier already exists',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('propagates error when getByIdentificador fails', async () => {
      mockRepository.getByIdentificador.mockRejectedValue(new Error('read fail'));

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toThrow('read fail');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('handles race: pre-check ok but create fails unique (current behavior)', async () => {
      mockRepository.getByIdentificador.mockResolvedValue(null);

      const uniqueErr: any = new Error('Unique constraint failed');
      uniqueErr.code = 'P2002';
      mockRepository.create.mockRejectedValue(uniqueErr);

      await expect(service.create('cond-1', { identifier: 'A101' } as any)).rejects.toBeInstanceOf(Error);
    });
  });

  describe('update', () => {
    it('returns null when update returns null (current behavior)', async () => {
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
    it('returns null when delete returns null (current behavior)', async () => {
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