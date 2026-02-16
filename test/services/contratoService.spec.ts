import { Test, TestingModule } from '@nestjs/testing';
import { ContratoService } from 'src/services/contracts/contrato.service';
import { ContratoRepository } from 'src/repositories/contratos/contrato.repository';
import { BadRequestException } from '@nestjs/common';

describe('ContratoService', () => {
  let service: ContratoService;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContratoService,
        { provide: ContratoRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get(ContratoService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all contracts', async () => {
    mockRepository.getAll.mockResolvedValue([]);

    const result = await service.getAll();

    expect(result).toEqual([]);
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should get by id', async () => {
    const item = { id: '1' } as any;
    mockRepository.getById.mockResolvedValue(item);

    const result = await service.getById('1');

    expect(result).toBe(item);
    expect(mockRepository.getById).toHaveBeenCalledWith('1');
  });

  describe('create', () => {
    it('should create when no duplicate found', async () => {
      const dto: any = { ownerId: 'o1', propertyId: 'p1' };
      mockRepository.findFirst.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ id: 'c1', ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 'c1', ...dto });
      expect(mockRepository.findFirst).toHaveBeenCalledWith(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequest when duplicate exists', async () => {
      const dto: any = { ownerId: 'o1', propertyId: 'p1' };
      mockRepository.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.create(dto)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('propagates repository error when pre-check fails', async () => {
      mockRepository.findFirst.mockRejectedValue(new Error('db error'));

      await expect(service.create({} as any)).rejects.toThrow('db error');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('propagates repository error when create fails', async () => {
      const dto: any = { ownerId: 'o1', propertyId: 'p1' };
      mockRepository.findFirst.mockResolvedValue(null);
      mockRepository.create.mockRejectedValue(new Error('insert fail'));

      await expect(service.create(dto)).rejects.toThrow('insert fail');
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update and return entity', async () => {
      const dto: any = { term: '12m' };
      mockRepository.update.mockResolvedValue({ id: 'c1', ...dto });

      const result = await service.update('c1', dto);

      expect(result).toEqual({ id: 'c1', ...dto });
      expect(mockRepository.update).toHaveBeenCalledWith('c1', dto);
    });

    it('propagates repository error', async () => {
      mockRepository.update.mockRejectedValue(new Error('deadlock'));

      await expect(service.update('c1', {} as any)).rejects.toThrow('deadlock');
    });
  });

  describe('delete', () => {
    it('should delete and return soft-deleted entity', async () => {
      const deleted: any = { id: 'c1', deletedAt: new Date() };
      mockRepository.delete.mockResolvedValue(deleted);

      const result = await service.delete('c1');

      expect(result).toBe(deleted);
      expect(mockRepository.delete).toHaveBeenCalledWith('c1');
    });

    it('propagates repository error on delete', async () => {
      mockRepository.delete.mockRejectedValue(new Error('forbidden'));

      await expect(service.delete('c1')).rejects.toThrow('forbidden');
    });
  });
});
