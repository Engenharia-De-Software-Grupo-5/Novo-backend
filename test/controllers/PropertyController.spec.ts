import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from 'src/controllers/condominiums/property.controller';
import { PropertyService } from 'src/services/condominiums/property.service';

describe('PropertyController', () => {
  let controller: PropertyController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [
        { provide: PropertyService, useValue: mockService },
      ],
    }).compile();

    controller = module.get(PropertyController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return properties', async () => {
    mockService.getAll.mockResolvedValue([]);
    const result = await controller.getAll('cond1');
    expect(result).toEqual([]);
  });

  it('should create property', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const result = await controller.create('cond1', {} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should update property', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    const result = await controller.update('cond1', 'prop1', {} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should delete property', async () => {
    mockService.delete.mockResolvedValue({ id: '1' });
    const result = await controller.delete('cond1', 'prop1');
    expect(result).toEqual({ id: '1' });
  });
});