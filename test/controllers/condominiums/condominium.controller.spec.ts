import { Test, TestingModule } from '@nestjs/testing';

import { CondominiumController } from 'src/controllers/condominiums/condominium.controller';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('CondominiumController', () => {
  let controller: CondominiumController;
  let service: jest.Mocked<CondominiumService>;

  const mockService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondominiumController],
      providers: [{ provide: CondominiumService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(CondominiumController);
    service = module.get(CondominiumService);
  });

  it('create should call service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.create({ name: 'Condo' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'Condo' });
    expect(res).toEqual({ id: 'c1' });
  });

  it('getAll should call service.getAll()', async () => {
    service.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await controller.getAll();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should call service.getById(id)', async () => {
    service.getById.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.getById('c1');

    expect(service.getById).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('update should call service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.update('c1', { name: 'Updated' } as any);

    expect(service.update).toHaveBeenCalledWith('c1', { name: 'Updated' });
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should call service.delete(id)', async () => {
    service.delete.mockResolvedValue(undefined as any);

    const res = await controller.delete('c1');

    expect(service.delete).toHaveBeenCalledWith('c1');
    expect(res).toBeUndefined();
  });
});