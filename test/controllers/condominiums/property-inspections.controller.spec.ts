import { Test, TestingModule } from '@nestjs/testing';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { PropertyInspectionsController } from 'src/controllers/condominiums/property-inspections.controller';
import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';

describe('PropertyInspectionsController', () => {
  let controller: PropertyInspectionsController;
  let service: jest.Mocked<PropertyInspectionsService>;

  const mockService = {
    upload: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const condoId = 'condo-1';
  const propertyId = 'prop-1';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyInspectionsController],
      providers: [{ provide: PropertyInspectionsService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyInspectionsController);
    service = module.get(PropertyInspectionsService);
  });

  it('create should call service.create(condominiumId, propertyId, dto)', async () => {
    service.upload.mockResolvedValue({ id: 'i1' } as any);

    const dto: any = { notes: 'ok' };
    const res = await controller.upload(condoId, propertyId, dto);

    expect(service.upload).toHaveBeenCalledWith(condoId, propertyId, dto);
    expect(res).toEqual({ id: 'i1' });
  });

  it('list should call service.list(condominiumId, propertyId)', async () => {
    service.list.mockResolvedValue([{ id: 'i1' }] as any);

    const res = await controller.list(condoId, propertyId);

    expect(service.list).toHaveBeenCalledWith(condoId, propertyId);
    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('findOne should call service.findOne(condominiumId, propertyId, inspectionId)', async () => {
    service.findOne.mockResolvedValue({ id: 'i1' } as any);

    const res = await controller.findOne(condoId, propertyId, 'i1');

    expect(service.findOne).toHaveBeenCalledWith(condoId, propertyId, 'i1');
    expect(res).toEqual({ id: 'i1' });
  });

  it('remove should call service.remove(condominiumId, propertyId, inspectionId)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove(condoId, propertyId, 'i1');

    expect(service.remove).toHaveBeenCalledWith(condoId, propertyId, 'i1');
    expect(res).toBeUndefined();
  });
});