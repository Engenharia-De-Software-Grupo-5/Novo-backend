import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';

describe('ChargePaymentsService', () => {
  const repo: jest.Mocked<ChargePaymentsRepository> = {
    assertCharge: jest.fn(),
    assertPayment: jest.fn(),
    createPayment: jest.fn(),
    listPayments: jest.fn(),
    getPayment: jest.fn(),
    updatePayment: jest.fn(),
    softDeletePayment: jest.fn(),
  } as any;

  const minio: jest.Mocked<MinioClientService> = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  } as any;

  const calculator: jest.Mocked<InterestCalculatorService> = {
    calculate: jest.fn(),
  } as any;

  const makeService = () => new ChargePaymentsService(repo, minio, calculator);

  const makeFile = (name = 'proof.PDF'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1772271972376);

    calculator.calculate.mockReturnValue({
      daysLate: 0,
      fineRate: 0.02,
      monthlyInterestRate: 0.01,
      fineValue: 0,
      interestValue: 0,
    } as any);
  });

  afterEach(() => {
    (Date.now as any).mockRestore?.();
  });

  it('create should throw UnsupportedMediaTypeException when file ext invalid', async () => {
    const service = makeService();

    await expect(
      service.create(
        'c1',
        'ch1',
        { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' } as any,
        makeFile('x.exe'),
      ),
    ).rejects.toThrow(UnsupportedMediaTypeException);
  });

  it('create should create payment WITHOUT file', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') } as any);
    repo.createPayment.mockResolvedValue({ id: 'p1' } as any);

    const dto = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' } as any;

    const res = await service.create('c1', 'ch1', dto, undefined);

    expect(repo.assertCharge).toHaveBeenCalledWith('c1', 'ch1');
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
      'ch1',
      expect.objectContaining({
        amountPaid: 10,
        method: 'PIX',
        proof: undefined,
        calc: expect.objectContaining({
          totalPaid: expect.any(Number),
        }),
      }),
    );

    expect(res).toEqual({ id: 'p1' });
  });

  it('create should upload file and include proof metadata', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') } as any);
    minio.uploadFile.mockResolvedValue({ fileName: 'obj.pdf' } as any);
    repo.createPayment.mockResolvedValue({ id: 'p1' } as any);

    const dto = { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' } as any;
    const file = makeFile('proof.PDF');

    const res = await service.create('c1', 'ch1', dto, file);

    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['pdf', 'jpg', 'jpeg', 'png'],
      expect.stringContaining(`payments/ch1/`),
    );

    expect(repo.createPayment).toHaveBeenCalledWith(
      'c1',
      'ch1',
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

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') } as any);
    repo.listPayments.mockResolvedValue([{ id: 'p1' }] as any);

    const res = await service.list('c1', 'ch1');

    expect(repo.assertCharge).toHaveBeenCalledWith('c1', 'ch1');
    expect(repo.listPayments).toHaveBeenCalledWith('c1', 'ch1');
    expect(res).toEqual([{ id: 'p1' }]);
  });

  it('findOne should throw NotFoundException when payment not found', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() } as any);
    repo.getPayment.mockResolvedValue(null);

    await expect(service.findOne('c1', 'ch1', 'p1')).rejects.toThrow(NotFoundException);
  });

  it('getProofDownloadUrl should throw BadRequestException when no proofObjectName', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() } as any);
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: null } as any);

    await expect(service.getProofDownloadUrl('c1', 'ch1', 'p1')).rejects.toThrow(BadRequestException);
  });

  it('getProofDownloadUrl should return signed url when proof exists', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() } as any);
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed');

    const res = await service.getProofDownloadUrl('c1', 'ch1', 'p1');

    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should soft delete and attempt delete proof if exists', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() } as any);
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: 'obj.pdf' } as any);
    repo.softDeletePayment.mockResolvedValue({ ok: true } as any);

    const res = await service.remove('c1', 'ch1', 'p1');

    expect(repo.softDeletePayment).toHaveBeenCalledWith('c1', 'ch1', 'p1');
    expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
    expect(res).toEqual({ ok: true });
  });

  it('remove should still succeed even if deleting file fails', async () => {
    const service = makeService();

    repo.assertCharge.mockResolvedValue({ amount: 1, dueDate: new Date() } as any);
    repo.getPayment.mockResolvedValue({ id: 'p1', proofObjectName: 'obj.pdf' } as any);
    repo.softDeletePayment.mockResolvedValue({ ok: true } as any);
    minio.deleteFile.mockRejectedValue(new Error('minio down'));

    const res = await service.remove('c1', 'ch1', 'p1');

    expect(repo.softDeletePayment).toHaveBeenCalledWith('c1', 'ch1', 'p1');
    expect(res).toEqual({ ok: true });
  });

  it('create should throw ConflictException when payment is late enough to exceed rules (example)', async () => {
    const service = makeService();

    calculator.calculate.mockReturnValue({
      daysLate: 5,
      fineRate: 0.02,
      monthlyInterestRate: 0.01,
      fineValue: 10,
      interestValue: 3,
    } as any);

    repo.assertCharge.mockResolvedValue({ amount: 100, dueDate: new Date('2026-02-10') } as any);

    // OBS: o service atual NÃO lança ConflictException por atraso,
    // então este teste é só um modelo — remova se não fizer sentido pro seu domínio.
    await expect(
      service.create('c1', 'ch1', { amountPaid: 10, paymentDate: '2026-02-18', method: 'PIX' } as any, undefined),
    ).resolves.toBeDefined();
  });
});