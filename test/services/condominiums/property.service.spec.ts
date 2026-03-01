import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { PropertyService } from 'src/services/condominiums/property.service';
import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

describe('PropertyService', () => {
  let service: PropertyService;
  let repo: jest.Mocked<PropertyRepository>;

  const mockRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByIdentificador: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PropertyRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(PropertyService);
    repo = module.get(PropertyRepository);

    jest.clearAllMocks();
  });

  it('getAll should call repo.getAll(condominiumId)', async () => {
    repo.getAll.mockResolvedValue([{ id: 'p1' }] as any);

    const res = await service.getAll('c1');

    expect(repo.getAll).toHaveBeenCalledWith('c1');
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('getById should call repo.getById(condominiumId, propertyId)', async () => {
    repo.getById.mockResolvedValue({ id: 'p1' } as any);

    const res = await service.getById('c1', 'p1');

    expect(repo.getById).toHaveBeenCalledWith('c1', 'p1');
    expect(res).toEqual({ id: 'p1' });
  });

  it('getByIdentificador should call repo.getByIdentificador(condominiumId, identificador)', async () => {
    repo.getByIdentificador.mockResolvedValue({ id: 'p1', identifier: 'A-101' } as any);

    const res = await service.getByIdentificador('c1', 'A-101');

    expect(repo.getByIdentificador).toHaveBeenCalledWith('c1', 'A-101');
    expect(res).toEqual({ id: 'p1', identifier: 'A-101' });
  });

  describe('create', () => {
    it('should throw ConflictException when identifier already exists in condominium', async () => {
      repo.getByIdentificador.mockResolvedValue({ id: 'pExisting' } as any);

      await expect(
        service.create('c1', { identifier: 'A-101' } as any),
      ).rejects.toThrow(ConflictException);

      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should create when identifier does not exist', async () => {
      repo.getByIdentificador.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: 'p1' } as any);

      const res = await service.create('c1', { identifier: 'A-101' } as any);

      expect(repo.getByIdentificador).toHaveBeenCalledWith('c1', 'A-101');
      expect(repo.create).toHaveBeenCalledWith('c1', { identifier: 'A-101' });
      expect(res).toEqual({ id: 'p1' });
    });
  });

  it('update should call repo.update(condominiumId, propertyId, dto)', async () => {
    repo.update.mockResolvedValue({ id: 'p1' } as any);

    const res = await service.update('c1', 'p1', { identifier: 'B-202' } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', 'p1', { identifier: 'B-202' });
    expect(res).toEqual({ id: 'p1' });
  });

  it('delete should call repo.delete(condominiumId, propertyId)', async () => {
    repo.delete.mockResolvedValue({ id: 'p1' } as any);

    const res = await service.delete('c1', 'p1');

    expect(repo.delete).toHaveBeenCalledWith('c1', 'p1');
    expect(res).toEqual({ id: 'p1' });
  });
});