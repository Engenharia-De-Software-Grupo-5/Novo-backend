import { Test, TestingModule } from '@nestjs/testing';

import { TenantController } from 'src/controllers/tenants/tenant.controller';
import { TenantService } from 'src/services/tenants/tenant.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('TenantController', () => {
  let controller: TenantController;
  let service: jest.Mocked<TenantService>;

  const mockService = {
    getAll: jest.fn(),
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
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(TenantController);
    service = module.get(TenantService);
  });

  it('getAll should call service.getAll()', async () => {
    service.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await controller.getAll();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getByCpf should call service.getByCpf(cpf)', async () => {
    service.getByCpf.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getByCpf('123');

    expect(service.getByCpf).toHaveBeenCalledWith('123');
    expect(res).toEqual({ id: 't1' });
  });

  it('getById should call service.getById(id)', async () => {
    service.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getById('t1');

    expect(service.getById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });

  it('create should call service.create(dto)', async () => {
    service.create.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.create({ cpf: '123' } as any);

    expect(service.create).toHaveBeenCalledWith({ cpf: '123' });
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call service.update(id, dto)', async () => {
    service.update.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.update('t1', { name: 'X' } as any);

    expect(service.update).toHaveBeenCalledWith('t1', { name: 'X' });
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteByCpf should call service.deleteByCpf(cpf)', async () => {
    service.deleteByCpf.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.deleteByCpf('123');

    expect(service.deleteByCpf).toHaveBeenCalledWith('123');
    expect(res).toEqual({ id: 't1' });
  });

  it('deleteById should call service.deleteById(id)', async () => {
    service.deleteById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.deleteById('t1');

    expect(service.deleteById).toHaveBeenCalledWith('t1');
    expect(res).toEqual({ id: 't1' });
  });
});