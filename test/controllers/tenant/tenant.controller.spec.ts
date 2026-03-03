import { Test, TestingModule } from '@nestjs/testing';

import { TenantController } from 'src/controllers/tenants/tenant.controller';
import { TenantService } from 'src/services/tenants/tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let service: jest.Mocked<TenantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get(TenantService);
  });

  it('getAll should call service.getAll', async () => {
    service.getAll.mockResolvedValue([{ id: 't1' }] as any);

    const res = await controller.getAll('c1');

    expect(service.getAll).toHaveBeenCalledWith('c1');
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('create should call service.create', async () => {
    service.create.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.create('c1', { name: 'A' } as any);

    expect(service.create).toHaveBeenCalledWith('c1', { name: 'A' });
    expect(res).toEqual({ id: 't1' });
  });

  it('getById should call service.getById', async () => {
    service.getById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.getById('c1', 't1');

    expect(service.getById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });

  it('update should call service.update', async () => {
    service.update.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.update('c1', 't1', { name: 'B' } as any);

    expect(service.update).toHaveBeenCalledWith('c1', 't1', { name: 'B' });
    expect(res).toEqual({ id: 't1' });
  });

  it('delete should call service.deleteById', async () => {
    service.deleteById.mockResolvedValue({ id: 't1' } as any);

    const res = await controller.delete('c1', 't1');

    expect(service.deleteById).toHaveBeenCalledWith('c1', 't1');
    expect(res).toEqual({ id: 't1' });
  });
});