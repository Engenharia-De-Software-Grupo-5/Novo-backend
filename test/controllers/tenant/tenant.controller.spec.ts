import { Test, TestingModule } from '@nestjs/testing';

import { TenantController } from 'src/controllers/tenants/tenant.controller';
import { TenantService } from 'src/services/tenants/tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let service: jest.Mocked<TenantService>;

  const mockService = {
    getAll: jest.fn(),
    getPaginated: jest.fn(),
    getByCpf: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteByCpf: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [{ provide: TenantService, useValue: mockService }],
    }).compile();

    controller = module.get(TenantController);
    service = module.get(TenantService);
  });

  it('getAll should call service.getAll()', async () => {
    service.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await controller.getAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('create should call service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.create({ name: 'A' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'A' });
    expect(res).toEqual({ id: 't1' });
  });

  it('getById should call service.getById(id)', async () => {
    service.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getById('t1');

    expect(service.getById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.update('t1', { name: 'B' } as any);

    expect(service.update).toHaveBeenCalledWith('t1', { name: 'B' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call service.deleteById(id)', async () => {
    service.deleteById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.delete('t1');

    expect(service.deleteById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });
});