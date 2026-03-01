import { Test, TestingModule } from '@nestjs/testing';

import { ChargesController } from 'src/controllers/charges/charge.controller';
import { ChargesService } from 'src/services/charges/charges.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ChargesController', () => {
  let controller: ChargesController;
  let service: jest.Mocked<ChargesService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargesController],
      providers: [{ provide: ChargesService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ChargesController);
    service = module.get(ChargesService);
  });

  it('create should call service.create(condominiumId, dto)', async () => {
    service.create.mockResolvedValue({ id: 'ch1' } as any);

    const res = await controller.create('c1', {} as any);

    expect(service.create).toHaveBeenCalledWith('c1', {});
    expect(res).toEqual({ id: 'ch1' });
  });

  it('list should call service.list({ condominiumId, tenantId, propertyId, status })', async () => {
    service.list.mockResolvedValue([{ id: 'ch1' }] as any);

    const res = await controller.list('c1', 't1', 'p1', 'OPEN' as any);

    expect(service.list).toHaveBeenCalledWith({
      condominiumId: 'c1',
      tenantId: 't1',
      propertyId: 'p1',
      status: 'OPEN',
    });
    expect(res).toEqual([{ id: 'ch1' }]);
  });

  it('findOne should call service.findOne(condominiumId, chargeId)', async () => {
    service.findOne.mockResolvedValue({ id: 'ch1' } as any);

    const res = await controller.findOne('c1', 'ch1');

    expect(service.findOne).toHaveBeenCalledWith('c1', 'ch1');
    expect(res).toEqual({ id: 'ch1' });
  });

  it('update should call service.update(condominiumId, chargeId, dto)', async () => {
    service.update.mockResolvedValue({ id: 'ch1' } as any);

    const res = await controller.update('c1', 'ch1', { status: 'X' } as any);

    expect(service.update).toHaveBeenCalledWith('c1', 'ch1', { status: 'X' });
    expect(res).toEqual({ id: 'ch1' });
  });

  it('cancel should call service.cancel(condominiumId, chargeId)', async () => {
    service.cancel.mockResolvedValue({ id: 'ch1' } as any);

    const res = await controller.cancel('c1', 'ch1');

    expect(service.cancel).toHaveBeenCalledWith('c1', 'ch1');
    expect(res).toEqual({ id: 'ch1' });
  });

  it('remove should call service.remove(condominiumId, chargeId)', async () => {
    service.remove.mockResolvedValue({ message: 'ok' } as any);

    await controller.remove('c1', 'ch1');

    expect(service.remove).toHaveBeenCalledWith('c1', 'ch1');
  });
});