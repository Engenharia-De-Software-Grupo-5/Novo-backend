import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from 'src/controllers/tenants/tenant.controller';
import { TenantService } from 'src/services/tenants/tenant.service';

describe('TenantController', () => {
  let controller: TenantController;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
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
      controllers: [TenantController],
      providers: [{ provide: TenantService, useValue: mockService }],
    }).compile();

    controller = module.get(TenantController);
  });

  afterEach(() => jest.clearAllMocks());

  it('CT-01 - should create tenant with valid data', async () => {
    mockService.create.mockResolvedValue({ id: 'ten-1', ...validCreateDto });

    const result = await controller.create(validCreateDto);

    expect(mockService.create).toHaveBeenCalledWith(validCreateDto);
    expect(result).toEqual({ id: 'ten-1', ...validCreateDto });
  });

  it('CT-02 - should return 400 when service rejects duplicated CPF', async () => {
    mockService.create.mockRejectedValue(
      new BadRequestException('This tenant CPF already exists in the database.'),
    );

    await expect(controller.create(validCreateDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('CT-03 - should return list of tenants', async () => {
    mockService.getAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);

    const result = await controller.getAll();

    expect(mockService.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('CT-04 - should return tenant by id when found', async () => {
    mockService.getById.mockResolvedValue({ id: 'ten-1', ...validCreateDto });

    const result = await controller.getById('ten-1');

    expect(mockService.getById).toHaveBeenCalledWith('ten-1');
    expect(result).toEqual({ id: 'ten-1', ...validCreateDto });
  });

  it('CT-05 - should propagate NotFound when service throws NotFound', async () => {
    mockService.getById.mockRejectedValue(new NotFoundException('Tenant not found'));

    await expect(controller.getById('ten-404')).rejects.toThrow(NotFoundException);
  });

  it('CT-06 - should update tenant with valid data', async () => {
    mockService.update.mockResolvedValue({ id: 'ten-1', name: 'Novo Nome', cpf: '11111111111' });

    const result = await controller.update('ten-1', { name: 'Novo Nome', cpf: '11111111111' } as any);

    expect(mockService.update).toHaveBeenCalledWith('ten-1', { name: 'Novo Nome', cpf: '11111111111' });
    expect(result).toEqual({ id: 'ten-1', name: 'Novo Nome', cpf: '11111111111' });
  });

  it('CT-07 - should propagate BadRequest from service on update', async () => {
    mockService.update.mockRejectedValue(new BadRequestException('Invalid update'));

    await expect(controller.update('ten-1', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('CT-08 - should delete tenant and return success', async () => {
    mockService.delete.mockResolvedValue({ id: 'ten-1', ...validCreateDto });

    const result = await controller.delete('ten-1');

    expect(mockService.delete).toHaveBeenCalledWith('ten-1');
    expect(result).toEqual({ id: 'ten-1', ...validCreateDto });
  });

  it('CT-09 - should propagate NotFound from service on delete', async () => {
    mockService.delete.mockRejectedValue(new NotFoundException('Tenant not found'));

    await expect(controller.delete('ten-404')).rejects.toThrow(NotFoundException);
  });

  it('CT-10 - should propagate BadRequest from service on create', async () => {
    mockService.create.mockRejectedValue(new BadRequestException('bad'));

    await expect(controller.create({} as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});