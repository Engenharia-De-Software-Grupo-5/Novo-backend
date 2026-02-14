import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { BadRequestException } from '@nestjs/common';

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
});