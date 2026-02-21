import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TenantService } from 'src/services/tenants/tenant.service';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';

describe('TenantService', () => {
  let service: TenantService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCpf: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const validCreateDto: any = {
    name: 'João da Silva',
    cpf: '11111111111',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: TenantRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(TenantService);
  });

  afterEach(() => jest.resetAllMocks());

  it('CT-01 - should return list of tenants', async () => {
    mockRepository.getAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await service.getAll();

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('CT-02 - should return tenant by id', async () => {
    mockRepository.getById.mockResolvedValue({ id: 'ten-1', ...validCreateDto });

    const result = await service.getById('ten-1');

    expect(mockRepository.getById).toHaveBeenCalledWith('ten-1');
    expect(result).toEqual({ id: 'ten-1', ...validCreateDto });
  });

  it('CT-03 - should create tenant when cpf does not exist', async () => {
    mockRepository.getByCpf.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue({ id: 'ten-1', ...validCreateDto });

    const result = await service.create(validCreateDto);

    expect(mockRepository.getByCpf).toHaveBeenCalledWith(validCreateDto.cpf);
    expect(mockRepository.create).toHaveBeenCalledWith(validCreateDto);
    expect(result).toEqual({ id: 'ten-1', ...validCreateDto });
  });

  it('CT-04 - should throw BadRequest when cpf already exists', async () => {
    mockRepository.getByCpf.mockResolvedValue({ id: 'existing', ...validCreateDto });

    await expect(service.create(validCreateDto)).rejects.toBeInstanceOf(BadRequestException);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('CT-05 - should update tenant', async () => {
    mockRepository.update.mockResolvedValue({ id: 'ten-1', name: 'Novo', cpf: '11111111111' });

    const result = await service.update('ten-1', { name: 'Novo', cpf: '11111111111' } as any);

    expect(mockRepository.update).toHaveBeenCalledWith('ten-1', { name: 'Novo', cpf: '11111111111' });
    expect(result).toEqual({ id: 'ten-1', name: 'Novo', cpf: '11111111111' });
  });

  it('CT-06 - should delete tenant (soft delete)', async () => {
    mockRepository.delete.mockResolvedValue({ id: 'ten-1' });

    const result = await service.delete('ten-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('ten-1');
    expect(result).toEqual({ id: 'ten-1' });
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

      await expect(service.getById('id-404')).resolves.toBeNull();
      expect(mockRepository.getById).toHaveBeenCalledWith('id-404');
    });

    it('propagates repository error', async () => {
      mockRepository.getById.mockRejectedValue(new Error('timeout'));

      await expect(service.getById('id-1')).rejects.toThrow('timeout');
    });
  });

  describe('create', () => {
    it('propagates error when getByCpf fails', async () => {
      mockRepository.getByCpf.mockRejectedValue(new Error('DB read fail'));

      await expect(service.create(validCreateDto)).rejects.toThrow('DB read fail');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('handles race condition: getByCpf null but create fails with unique -> Error (current behavior)', async () => {
      mockRepository.getByCpf.mockResolvedValue(null);

      const uniqueErr: any = new Error('Unique constraint failed');
      uniqueErr.code = 'P2002';
      mockRepository.create.mockRejectedValue(uniqueErr);

      await expect(service.create(validCreateDto)).rejects.toBeInstanceOf(Error);
      expect(mockRepository.getByCpf).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('returns null when updating non-existent (repo returns null) (current behavior)', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('id-404', { name: 'X', cpf: '1' } as any)).resolves.toBeNull();
    });

    it('propagates repository error on update', async () => {
      mockRepository.update.mockRejectedValue(new Error('deadlock'));

      await expect(service.update('id-1', { name: 'X', cpf: '1' } as any)).rejects.toThrow('deadlock');
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