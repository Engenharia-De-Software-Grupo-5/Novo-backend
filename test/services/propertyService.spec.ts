import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from 'src/services/condominiums/property.service';
import { PropertyRepository } from 'src/repositories/condominiums/property.repository';

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
});