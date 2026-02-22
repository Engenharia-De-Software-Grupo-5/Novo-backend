import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from 'src/controllers/condominiums/property.controller';
import { PropertyService } from 'src/services/condominiums/property.service';

describe('PropertyController (CT-11..CT-20)', () => {
  let controller: PropertyController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
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
      controllers: [PropertyController],
      providers: [{ provide: PropertyService, useValue: mockService }],
    }).compile();

    controller = module.get(PropertyController);
  });

  afterEach(() => jest.clearAllMocks());

  
  it('CT-11 - should create property with valid data', async () => {
    mockService.create.mockResolvedValue({ id: 'prop-1', ...validCreateDto });

    const result = await controller.create(condominiumId, validCreateDto);

    expect(mockService.create).toHaveBeenCalledWith(condominiumId, validCreateDto);
    expect(result).toEqual({ id: 'prop-1', ...validCreateDto });
  });

  
  it('CT-12 - should return 400 when service rejects missing identifier', async () => {
    mockService.create.mockRejectedValue(
      new BadRequestException('Identificador do imóvel é obrigatório'),
    );

    await expect(controller.create(condominiumId, { unityNumber: '101' } as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-13 - should return 400 when service rejects missing unityNumber', async () => {
    mockService.create.mockRejectedValue(
      new BadRequestException('Número do imóvel é obrigatório'),
    );

    await expect(controller.create(condominiumId, { identifier: 'A101' } as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-14 - should return list of properties', async () => {
    mockService.getAll.mockResolvedValue([{ id: 'prop-1' }, { id: 'prop-2' }]);

    const result = await controller.getAll(condominiumId);

    expect(mockService.getAll).toHaveBeenCalledWith(condominiumId);
    expect(result).toEqual([{ id: 'prop-1' }, { id: 'prop-2' }]);
  });

  
  it('CT-15 - should return property by valid id', async () => {
    mockService.getById.mockResolvedValue({ id: 'prop-1', ...validCreateDto });

    const result = await controller.getById(condominiumId, 'prop-1');

    expect(mockService.getById).toHaveBeenCalledWith(condominiumId, 'prop-1');
    expect(result).toEqual({ id: 'prop-1', ...validCreateDto });
  });

  
  it('CT-16 - should return 404 when service throws NotFound', async () => {
    mockService.getById.mockRejectedValue(
      new NotFoundException('Imóvel não encontrado'),
    );

    await expect(controller.getById(condominiumId, 'prop-404'))
      .rejects
      .toThrow(NotFoundException);
  });

  
  it('CT-17 - should update property with valid data', async () => {
    mockService.update.mockResolvedValue({ id: 'prop-1', observations: 'novo' });

    const result = await controller.update(condominiumId, 'prop-1', { observations: 'novo' } as any);

    expect(mockService.update).toHaveBeenCalledWith(condominiumId, 'prop-1', { observations: 'novo' });
    expect(result).toEqual({ id: 'prop-1', observations: 'novo' });
  });

  
  it('CT-18 - should return 400 when service rejects empty update body', async () => {
    mockService.update.mockRejectedValue(new BadRequestException('Body vazio'));

    await expect(controller.update(condominiumId, 'prop-1', {} as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-19 - should delete property and return success', async () => {
    mockService.delete.mockResolvedValue({ id: 'prop-1' });

    const result = await controller.delete(condominiumId, 'prop-1');

    expect(mockService.delete).toHaveBeenCalledWith(condominiumId, 'prop-1');
    expect(result).toEqual({ id: 'prop-1' });
  });

  
  it('CT-20 - should return 404 when service throws NotFound on delete', async () => {
    mockService.delete.mockRejectedValue(
      new NotFoundException('Imóvel não encontrado'),
    );

    await expect(controller.delete(condominiumId, 'prop-404'))
      .rejects
      .toThrow(NotFoundException);
  });

  

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

  it('passes condominiumId to getAll', async () => {
    mockService.getAll.mockResolvedValue([]);
    await controller.getAll('cond-1');
    expect(mockService.getAll).toHaveBeenCalledWith('cond-1');
  });

  it('passes both ids on update', async () => {
    mockService.update.mockResolvedValue({ ok: true });

    await controller.update('cond-1', 'prop-1', { address: 'x' } as any);

    expect(mockService.update).toHaveBeenCalledWith('cond-1', 'prop-1', { address: 'x' });
  });

  it('propagates NotFound from service', async () => {
    mockService.getById.mockRejectedValue(new NotFoundException());
    await expect(controller.getById('cond-1', 'prop-404')).rejects.toBeInstanceOf(NotFoundException);
  });
});