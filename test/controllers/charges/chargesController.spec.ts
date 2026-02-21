import { Test, TestingModule } from '@nestjs/testing';

import { ChargesService } from 'src/services/charges/charges.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChargeStatus, PaymentMethod } from '@prisma/client';
import { ChargesController } from 'src/controllers/charges/charge.controller';

describe('ChargesController', () => {
  let controller: ChargesController;
  let service: jest.Mocked<ChargesService>;

  const createServiceMock = (): jest.Mocked<ChargesService> => ({
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<ChargesService>);

  const guardMock = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [ChargesController],
      providers: [{ provide: ChargesService, useValue: createServiceMock() }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(guardMock)
      .overrideGuard(RolesGuard)
      .useValue(guardMock);

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get(ChargesController);
    service = module.get(ChargesService);
  });

  it('should create charge', async () => {
    const dto = {
      tenantId: 't-1',
      propertyId: 'p-1',
      amount: 100,
      dueDate: '2026-03-10',
      paymentMethod: PaymentMethod.PIX,
    };

    service.create.mockResolvedValue({ id: 'c-1' } as any);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 'c-1' });
  });

  it('should list charges', async () => {
    service.list.mockResolvedValue([{ id: 'c-1' }] as any);

    const result = await controller.list('t-1', 'p-1', ChargeStatus.PENDING);

    expect(service.list).toHaveBeenCalledWith({
      tenantId: 't-1',
      propertyId: 'p-1',
      status: ChargeStatus.PENDING,
    });
    expect(result).toEqual([{ id: 'c-1' }]);
  });

  it('should find one charge', async () => {
    service.findOne.mockResolvedValue({ id: 'c-1' } as any);

    const result = await controller.findOne('c-1');

    expect(service.findOne).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ id: 'c-1' });
  });

  it('should update charge', async () => {
    service.update.mockResolvedValue({ id: 'c-1', amount: 200 } as any);

    const dto = { amount: 200 };
    const result = await controller.update('c-1', dto as any);

    expect(service.update).toHaveBeenCalledWith('c-1', dto);
    expect(result).toEqual({ id: 'c-1', amount: 200 });
  });

  it('should cancel charge', async () => {
    service.cancel.mockResolvedValue({
      id: 'c-1',
      status: ChargeStatus.CANCELED,
    } as any);

    const result = await controller.cancel('c-1');

    expect(service.cancel).toHaveBeenCalledWith('c-1');
    expect(result).toEqual({ id: 'c-1', status: ChargeStatus.CANCELED });
  });

  it('should remove charge', async () => {
  service.remove.mockResolvedValue({ message: 'Charge removed successfully.' } as any);

  const result = await controller.remove('c-1');

  expect(service.remove).toHaveBeenCalledWith('c-1');
  expect(result).toBeUndefined();
});
});