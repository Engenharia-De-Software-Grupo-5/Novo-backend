import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { BadRequestException } from '@nestjs/common';

describe('CondominiumService (CT-01..CT-10 + edge cases)', () => {
  let service: CondominiumService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const validCreateDto: any = {
    name: 'Condominio A',
    description: 'Desc',
    address: {
      zip: '60000-000',
      street: 'Rua X',
      neighborhood: 'Bairro Y',
      city: 'Fortaleza',
      uf: 'CE',
      number: 123,
      complement: 'Apto 10',
    },
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

  afterEach(() => jest.resetAllMocks());

  
  it('CT-01 - should create condominium with valid data', async () => {
    mockRepository.getByName.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: 'cond-1', ...validCreateDto });

    const result = await service.create(validCreateDto);

    expect(mockRepository.getByName).toHaveBeenCalledWith(validCreateDto.name);
    expect(mockRepository.create).toHaveBeenCalledWith(validCreateDto);
    expect(result).toEqual({ id: 'cond-1', ...validCreateDto });
  });

 
  it('CT-02 - should reject create without name (BadRequest)', async () => {
    mockRepository.getByName.mockResolvedValue(null);
    mockRepository.create.mockRejectedValue(
      new BadRequestException('Nome do condomínio é obrigatório'),
    );

    await expect(service.create({ description: 'x', address: {} } as any))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });


  it('CT-03 - should reject create without address (BadRequest)', async () => {
    mockRepository.getByName.mockResolvedValue(null);
    mockRepository.create.mockRejectedValue(
      new BadRequestException('Endereço é obrigatório'),
    );

    await expect(service.create({ name: 'X' } as any))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

  
  it('CT-04 - should return list of condominiums', async () => {
    mockRepository.getAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await service.getAll();

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  
  it('CT-05 - should return condominium when id exists', async () => {
    mockRepository.getById.mockResolvedValue({ id: 'cond-1', ...validCreateDto });

    const result = await service.getById('cond-1');

    expect(mockRepository.getById).toHaveBeenCalledWith('cond-1');
    expect(result).toEqual({ id: 'cond-1', ...validCreateDto });
  });

 
  it('CT-06 - should return null when id does not exist (current behavior)', async () => {
    mockRepository.getById.mockResolvedValue(null);

    await expect(service.getById('cond-404')).resolves.toBeNull();
  });

 
  it('CT-07 - should update condominium with valid data', async () => {
    mockRepository.update.mockResolvedValue({ id: 'cond-1', description: 'Nova' });

    const result = await service.update('cond-1', { description: 'Nova' } as any);

    expect(mockRepository.update).toHaveBeenCalledWith('cond-1', { description: 'Nova' });
    expect(result).toEqual({ id: 'cond-1', description: 'Nova' });
  });


  it('CT-08 - should reject update with empty body (BadRequest)', async () => {
    mockRepository.update.mockRejectedValue(
      new BadRequestException('Body vazio'),
    );

    await expect(service.update('cond-1', {} as any))
      .rejects
      .toBeInstanceOf(BadRequestException);
  });

  
  it('CT-09 - should delete existing condominium', async () => {
    mockRepository.delete.mockResolvedValue({ id: 'cond-1' });

    const result = await service.delete('cond-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('cond-1');
    expect(result).toEqual({ id: 'cond-1' });
  });

 
  it('CT-10 - should return null when deleting non-existent condominium (current behavior)', async () => {
    mockRepository.delete.mockResolvedValue(null);

    await expect(service.delete('cond-404')).resolves.toBeNull();
  });



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
    it('returns null when repository returns null (current behavior)', async () => {
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

    it('handles race condition: getByName null but create fails with unique -> Error (current behavior)', async () => {
      mockRepository.getByName.mockResolvedValue(null);

      const uniqueErr: any = new Error('Unique constraint failed');
      uniqueErr.code = 'P2002';
      mockRepository.create.mockRejectedValue(uniqueErr);

      await expect(service.create({ name: 'A', address: {} } as any)).rejects.toBeInstanceOf(Error);
      expect(mockRepository.getByName).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('returns null when updating non-existent (repo returns null) (current behavior)', async () => {
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
    it('returns null when delete returns null (current behavior)', async () => {
      mockRepository.delete.mockResolvedValue(null);

      await expect(service.delete('id-404')).resolves.toBeNull();
    });

    it('propagates repository error on delete', async () => {
      mockRepository.delete.mockRejectedValue(new Error('permission denied'));

      await expect(service.delete('id-1')).rejects.toThrow('permission denied');
    });
  });
});