import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumController } from 'src/controllers/condominiums/condominium.controller';
import { CondominiumService } from 'src/services/condominiums/condominium.service';

describe('CondominiumController (CT-01..CT-10)', () => {
  let controller: CondominiumController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const validCreateDto: any = {
    name: 'Condominio A',
    description: 'Descrição',
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
      controllers: [CondominiumController],
      providers: [{ provide: CondominiumService, useValue: mockService }],
    }).compile();

    controller = module.get(CondominiumController);
  });

  afterEach(() => jest.clearAllMocks());

  
  it('CT-01 - should create condominium with valid data', async () => {
    mockService.create.mockResolvedValue({ id: 'cond-1', ...validCreateDto });

    const result = await controller.create(validCreateDto);

    expect(mockService.create).toHaveBeenCalledWith(validCreateDto);
    expect(result).toEqual({ id: 'cond-1', ...validCreateDto });
  });

  
  it('CT-02 - should return 400 when service rejects missing name', async () => {
    mockService.create.mockRejectedValue(
      new BadRequestException('Nome do condomínio é obrigatório'),
    );

    await expect(controller.create({ description: 'x', address: {} } as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-03 - should return 400 when service rejects missing address', async () => {
    mockService.create.mockRejectedValue(
      new BadRequestException('Endereço é obrigatório'),
    );

    await expect(controller.create({ name: 'X' } as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-04 - should return list of condominiums', async () => {
    mockService.getAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await controller.getAll();

    expect(mockService.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  
  it('CT-05 - should return condominium by id when found', async () => {
    mockService.getById.mockResolvedValue({ id: 'cond-1', ...validCreateDto });

    const result = await controller.getById('cond-1');

    expect(mockService.getById).toHaveBeenCalledWith('cond-1');
    expect(result).toEqual({ id: 'cond-1', ...validCreateDto });
  });

  
  it('CT-06 - should return 404 when service throws NotFound', async () => {
    mockService.getById.mockRejectedValue(
      new NotFoundException('Condomínio não encontrado'),
    );

    await expect(controller.getById('cond-404'))
      .rejects
      .toThrow(NotFoundException);
  });

  
  it('CT-07 - should update condominium with valid data', async () => {
    mockService.update.mockResolvedValue({ id: 'cond-1', description: 'Nova' });

    const result = await controller.update('cond-1', { description: 'Nova' } as any);

    expect(mockService.update).toHaveBeenCalledWith('cond-1', { description: 'Nova' });
    expect(result).toEqual({ id: 'cond-1', description: 'Nova' });
  });

  
  it('CT-08 - should return 400 when service rejects empty update body', async () => {
    mockService.update.mockRejectedValue(new BadRequestException('Body vazio'));

    await expect(controller.update('cond-1', {} as any))
      .rejects
      .toThrow(BadRequestException);
  });

  
  it('CT-09 - should delete condominium and return success', async () => {
    mockService.delete.mockResolvedValue({ id: 'cond-1' });

    const result = await controller.delete('cond-1');

    expect(mockService.delete).toHaveBeenCalledWith('cond-1');
    expect(result).toEqual({ id: 'cond-1' });
  });

  
  it('CT-10 - should return 404 when service throws NotFound on delete', async () => {
    mockService.delete.mockRejectedValue(
      new NotFoundException('Condomínio não encontrado'),
    );

    await expect(controller.delete('cond-404'))
      .rejects
      .toThrow(NotFoundException);
  });

  

  it('propagates NotFound from service', async () => {
    mockService.getById.mockRejectedValue(new NotFoundException('not found'));
    await expect(controller.getById('id-404')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('propagates BadRequest from service', async () => {
    mockService.create.mockRejectedValue(new BadRequestException('dup'));
    await expect(controller.create({} as any)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('passes correct params on update', async () => {
    mockService.update.mockResolvedValue({ ok: true });
    await controller.update('id-1', { description: 'x' } as any);

    expect(mockService.update).toHaveBeenCalledWith('id-1', { description: 'x' });
  });
});