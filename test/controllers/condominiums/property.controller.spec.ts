import { Test, TestingModule } from '@nestjs/testing';

import { PropertyController } from 'src/controllers/condominiums/property.controller';
import { PropertyService } from 'src/services/condominiums/property.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('PropertyController', () => {
  let controller: PropertyController;
  let service: jest.Mocked<PropertyService>;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const condoId = 'condo-1';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [{ provide: PropertyService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyController);
    service = module.get(PropertyService);
  });

  it('create should call service.create(condominiumId, dto)', async () => {
    service.create.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { name: 'Prop' };

    const res = await controller.create(condoId, dto);

    expect(service.create).toHaveBeenCalledWith(condoId, dto);
    expect(res).toEqual({ id: 'p1' });
  });

  it('getAll should call service.getAll(condominiumId)', async () => {
    service.getAll.mockResolvedValue([{ id: 'p1' }] as any);

    const res = await controller.getAll(condoId);

    expect(service.getAll).toHaveBeenCalledWith(condoId);
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('getById should call service.getById(condominiumId, propertyId)', async () => {
    service.getById.mockResolvedValue({ id: 'p1' } as any);

    const res = await controller.getById(condoId, 'p1');

    expect(service.getById).toHaveBeenCalledWith(condoId, 'p1');
    expect(res).toEqual({ id: 'p1' });
  });

  it('update should call service.update(condominiumId, propertyId, dto)', async () => {
    service.update.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { name: 'New' };

    const res = await controller.update(condoId, 'p1', dto);

    expect(service.update).toHaveBeenCalledWith(condoId, 'p1', dto);
    expect(res).toEqual({ id: 'p1' });
  });

  it('delete should call service.delete(condominiumId, propertyId)', async () => {
    service.delete.mockResolvedValue(undefined as any);

    const res = await controller.delete(condoId, 'p1');

    expect(service.delete).toHaveBeenCalledWith(condoId, 'p1');
    expect(res).toBeUndefined();
  });
});