import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumController } from 'src/controllers/condominiums/condominium.controller';
import { CondominiumService } from 'src/services/condominiums/condominium.service';

describe('CondominiumController', () => {
  let controller: CondominiumController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CondominiumController],
      providers: [
        { provide: CondominiumService, useValue: mockService },
      ],
    }).compile();

    controller = module.get(CondominiumController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all condominiums', async () => {
    mockService.getAll.mockResolvedValue([]);
    const result = await controller.getAll();
    expect(result).toEqual([]);
  });

  it('should create condominium', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const result = await controller.create({} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should update condominium', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    const result = await controller.update('1', {} as any);
    expect(result).toEqual({ id: '1' });
  });

  it('should delete condominium', async () => {
    mockService.delete.mockResolvedValue({ id: '1' });
    const result = await controller.delete('1');
    expect(result).toEqual({ id: '1' });
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