import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';

describe('ChargePaymentsService', () => {
  const repo = {
    assertCharge: jest.fn(),
    createPayment: jest.fn(),
    listPayments: jest.fn(),
    getPayment: jest.fn(),
    assertPayment: jest.fn(),
    updatePayment: jest.fn(),
    softDeletePayment: jest.fn(),
  };

  const minio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const calculator = {
    calculate: jest.fn(),
  };

  const makeFile = (name = 'proof.pdf', mime = 'application/pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: mime,
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  const makeService = () => new ChargePaymentsService(repo as any, minio as any, calculator as any);

  beforeEach(() => {
    jest.clearAllMocks();
    calculator.calculate.mockReturnValue({
      daysLate: 2,
      fineRate: 0.02,
      monthlyInterestRate: 0.01,
      fineValue: 10,
      interestValue: 5,
    });
  });

  it('create should throw UnsupportedMediaTypeException when file ext invalid', async () => {
    const service = makeService();

    await expect(
      service.create('c1', { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' } as any, makeFile('x.exe')),
    ).rejects.toThrow(UnsupportedMediaTypeException);
  });

  it('create should create payment WITHOUT file', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') });
    repo.createPayment.mockResolvedValue({ id: 'p1' });

    const dto: any = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' };

    const res = await service.create('c1', dto, undefined);

    expect(repo.assertCharge).toHaveBeenCalledWith('c1');
    expect(minio.uploadFile).not.toHaveBeenCalled();

    expect(calculator.calculate).toHaveBeenCalledWith(
      expect.objectContaining({
        principal: 100,
        dueDate: '2026-02-10',
        referenceDate: '2026-02-18',
      }),
    );

    expect(repo.createPayment).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({
        amountPaid: 10,
        method: 'PIX',
        proof: undefined,
        calc: expect.objectContaining({
          wasLate: true,
          daysLate: 2,
          finePaid: 10,
          interestPaid: 5,
          totalPaid: 25,
        }),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('create should upload file and include proof metadata', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') });
    minio.uploadFile.mockResolvedValue({ fileName: 'obj.pdf' });
    repo.createPayment.mockResolvedValue({ id: 'p1' });

    const file = makeFile('proof.PDF');
    const dto: any = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' };

    const res = await service.create('c1', dto, file);

    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['pdf', 'jpg', 'jpeg', 'png'],
      expect.stringContaining(`payments/c1/`),
    );

    expect(repo.createPayment).toHaveBeenCalledWith(
      'c1',
      expect.objectContaining({
        proof: expect.objectContaining({
          objectName: 'obj.pdf',
          originalName: 'proof.PDF',
          mimeType: 'application/pdf',
          extension: 'pdf',
          size: 10,
        }),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('list should assertCharge and then listPayments', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() });
    repo.listPayments.mockResolvedValue([{ id: 'p1' }]);

    const res = await service.list('c1');

    expect(repo.assertCharge).toHaveBeenCalledWith('c1');
    expect(repo.listPayments).toHaveBeenCalledWith('c1');
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('findOne should throw NotFoundException when payment not found', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() });
    repo.getPayment.mockResolvedValue(null);

    await expect(service.findOne('c1', 'p1')).rejects.toThrow(NotFoundException);
  });

  it('getProofDownloadUrl should throw BadRequestException when no proofObjectName', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() });
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: null });

    await expect(service.getProofDownloadUrl('c1', 'p1')).rejects.toThrow(BadRequestException);
  });

  it('getProofDownloadUrl should return signed url when proof exists', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() });
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: 'obj.pdf' });
    minio.getFileUrl.mockResolvedValue('signed');

    const res = await service.getProofDownloadUrl('c1', 'p1');

    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res).toEqual({ url: 'signed' });
  });

  it('update should merge fields, upload file, and attempt delete previous proof', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') });
    repo.assertPayment.mockResolvedValue({
      amountPaid: 10,
      paymentDate: new Date('2026-02-18'),
      method: 'PIX',
      fineRate: 0.02,
      monthlyRate: 0.01,
    });

    minio.uploadFile.mockResolvedValue({ fileName: 'new.pdf' });

    repo.updatePayment.mockResolvedValue({
      updated: { id: 'p1' },
      previousProofObject: 'old.pdf',
    });

    minio.deleteFile.mockRejectedValue(new Error('ignore'));

    const res = await service.update(
      'c1',
      'p1',
      { amountPaid: 20 } as any,
      makeFile('proof.pdf'),
    );

    expect(repo.updatePayment).toHaveBeenCalledWith(
      'c1',
      'p1',
      expect.objectContaining({
        amountPaid: 20,
        proof: expect.objectContaining({ objectName: 'new.pdf' }),
      }),
    );

    expect(minio.deleteFile).toHaveBeenCalledWith('old.pdf');
    expect(res).toEqual({ id: 'p1' });
  });

  it('remove should soft delete and attempt delete proof if exists', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() });
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: 'obj.pdf' });
    repo.softDeletePayment.mockResolvedValue({ ok: true });

    minio.deleteFile.mockRejectedValue(new Error('ignore'));

    const res = await service.remove('c1', 'p1');

    expect(repo.softDeletePayment).toHaveBeenCalledWith('c1', 'p1');
    expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
    expect(res).toEqual({ ok: true });
  });
});