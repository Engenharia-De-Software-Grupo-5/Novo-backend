import { Test, TestingModule } from '@nestjs/testing';

import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChargePaymentsController } from 'src/controllers/charges/charges-payment.controller';

describe('ChargePaymentsController', () => {
  let controller: ChargePaymentsController;
  let service: jest.Mocked<ChargePaymentsService>;

  const mockService = {
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    getProofDownloadUrl: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const makeFile = (name = 'proof.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargePaymentsController],
      providers: [{ provide: ChargePaymentsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ChargePaymentsController);
    service = module.get(ChargePaymentsService);
  });

  it('createPayment should call service.create(condId, chargeId, dto, file)', async () => {
    service.create.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' };
    const file = makeFile('a.pdf');

    const res = await controller.createPayment('c1', 'ch1', dto, file);

    expect(service.create).toHaveBeenCalledWith('c1', 'ch1', dto, file);
    expect(res).toEqual({ id: 'p1' });
  });

  it('createPayment should pass undefined when no file', async () => {
    service.create.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' };

    const res = await controller.createPayment('c1', 'ch1', dto, undefined);

    expect(service.create).toHaveBeenCalledWith('c1', 'ch1', dto, undefined);
    expect(res).toEqual({ id: 'p1' });
  });

  it('list should call service.list(condId, chargeId)', async () => {
    service.list.mockResolvedValue([{ id: 'p1' }] as any);

    const res = await controller.list('c1', 'ch1');

    expect(service.list).toHaveBeenCalledWith('c1', 'ch1');
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('findOne should call service.findOne(condId, chargeId, paymentId)', async () => {
    service.findOne.mockResolvedValue({ id: 'p1' } as any);

    const res = await controller.findOne('c1', 'ch1', 'p1');

    expect(service.findOne).toHaveBeenCalledWith('c1', 'ch1', 'p1');
    expect(res).toEqual({ id: 'p1' });
  });

  it('downloadProof should call service.getProofDownloadUrl(condId, chargeId, paymentId)', async () => {
    service.getProofDownloadUrl.mockResolvedValue({ url: 'signed' } as any);

    const res = await controller.downloadProof('c1', 'ch1', 'p1');

    expect(service.getProofDownloadUrl).toHaveBeenCalledWith('c1', 'ch1', 'p1');
    expect(res).toEqual({ url: 'signed' });
  });

  it('update should call service.update(condId, chargeId, paymentId, dto, file)', async () => {
    service.update.mockResolvedValue({ id: 'p1' } as any);

    const dto: any = { amountPaid: 20 };
    const file = makeFile('b.png');

    const res = await controller.update('c1', 'ch1', 'p1', dto, file);

    expect(service.update).toHaveBeenCalledWith('c1', 'ch1', 'p1', dto, file);
    expect(res).toEqual({ id: 'p1' });
  });

  it('remove should call service.remove(condId, chargeId, paymentId)', async () => {
    service.remove.mockResolvedValue({ ok: true } as any);

    const res = await controller.remove('c1', 'ch1', 'p1');

    expect(service.remove).toHaveBeenCalledWith('c1', 'ch1', 'p1');
    expect(res).toEqual({ ok: true });
  });
});