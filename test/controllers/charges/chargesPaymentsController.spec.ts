import { Test, TestingModule } from '@nestjs/testing';
import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ChargeStatus, PaymentMethod } from '@prisma/client';

describe('ChargePaymentsService', () => {
  let service: ChargePaymentsService;
  let repo: jest.Mocked<ChargePaymentsRepository>;
  let minio: jest.Mocked<MinioClientService>;
  let calculator: jest.Mocked<InterestCalculatorService>;

  const createRepoMock = (): jest.Mocked<ChargePaymentsRepository> => ({
    assertCharge: jest.fn(),
    assertPayment: jest.fn(),
    createPayment: jest.fn(),
    updatePayment: jest.fn(),
    listPayments: jest.fn(),
    getPayment: jest.fn(),
    softDeletePayment: jest.fn(),
    syncChargeStatus: jest.fn(),
  } as unknown as jest.Mocked<ChargePaymentsRepository>);

  const createMinioMock = (): jest.Mocked<MinioClientService> => ({
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
    listFiles: jest.fn(),
  } as unknown as jest.Mocked<MinioClientService>);

  const createCalcMock = (): jest.Mocked<InterestCalculatorService> => ({
    calculate: jest.fn(),
  } as unknown as jest.Mocked<InterestCalculatorService>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargePaymentsService,
        { provide: ChargePaymentsRepository, useValue: createRepoMock() },
        { provide: MinioClientService, useValue: createMinioMock() },
        { provide: InterestCalculatorService, useValue: createCalcMock() },
      ],
    }).compile();

    service = module.get(ChargePaymentsService);
    repo = module.get(ChargePaymentsRepository);
    minio = module.get(MinioClientService);
    calculator = module.get(InterestCalculatorService);
  });

  it('should create payment without proof file', async () => {
    repo.assertCharge.mockResolvedValue({
      id: 'c-1',
      amount: 100,
      dueDate: new Date('2026-03-10'),
      status: ChargeStatus.PENDING,
    } as any);

    calculator.calculate.mockReturnValue({
      daysLate: 0,
      fineRate: 2,
      monthlyInterestRate: 1,
      fineValue: 0,
      interestValue: 0,
      totalUpdated: 100,
    } as any);

    repo.createPayment.mockResolvedValue({ id: 'p-1' } as any);

    const dto = {
      amountPaid: 100,
      paymentDate: '2026-03-10',
      method: PaymentMethod.PIX,
    };

    const result = await service.create('c-1', dto as any);

    expect(repo.assertCharge).toHaveBeenCalledWith('c-1');
    expect(repo.createPayment).toHaveBeenCalled();
    expect(result).toEqual({ id: 'p-1' });
  });

  it('should reject invalid proof file extension', async () => {
    const file = {
      originalname: 'proof.exe',
      mimetype: 'application/octet-stream',
      size: 10,
      buffer: Buffer.from('x'),
    } as any;

    await expect(service.create('c-1', {} as any, file)).rejects.toBeInstanceOf(
      UnsupportedMediaTypeException,
    );
  });

  it('should list payments', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.listPayments.mockResolvedValue([{ id: 'p-1' }] as any);

    const result = await service.list('c-1');

    expect(repo.assertCharge).toHaveBeenCalledWith('c-1');
    expect(repo.listPayments).toHaveBeenCalledWith('c-1');
    expect(result).toEqual([{ id: 'p-1' }]);
  });

  it('should find one payment', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue({ id: 'p-1' } as any);

    const result = await service.findOne('c-1', 'p-1');

    expect(repo.getPayment).toHaveBeenCalledWith('c-1', 'p-1');
    expect(result).toEqual({ id: 'p-1' });
  });

  it('should throw NotFoundException when payment does not exist', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue(null as any);

    await expect(service.findOne('c-1', 'p-x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should get proof download url', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue({ id: 'p-1', proofObjectName: 'obj' } as any);

    minio.getFileUrl.mockResolvedValue('http://signed-url');

    const result = await service.getProofDownloadUrl('c-1', 'p-1');

    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(result).toEqual({ url: 'http://signed-url' });
  });

  it('should throw BadRequestException when payment has no proof', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue({ id: 'p-1', proofObjectName: null } as any);

    await expect(service.getProofDownloadUrl('c-1', 'p-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should remove payment and delete proof best-effort', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue({ id: 'p-1', proofObjectName: 'obj' } as any);
    repo.softDeletePayment.mockResolvedValue({ message: 'Payment removed successfully.' } as any);

    minio.deleteFile.mockResolvedValue(undefined as any);

    const result = await service.remove('c-1', 'p-1');

    expect(repo.softDeletePayment).toHaveBeenCalledWith('c-1', 'p-1');
    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(result).toEqual({ message: 'Payment removed successfully.' });
  });

  it('should remove payment even if minio deleteFile fails', async () => {
    repo.assertCharge.mockResolvedValue({ id: 'c-1' } as any);
    repo.getPayment.mockResolvedValue({ id: 'p-1', proofObjectName: 'obj' } as any);
    repo.softDeletePayment.mockResolvedValue({ message: 'Payment removed successfully.' } as any);

    minio.deleteFile.mockRejectedValue(new Error('minio error'));

    const result = await service.remove('c-1', 'p-1');

    expect(repo.softDeletePayment).toHaveBeenCalledWith('c-1', 'p-1');
    expect(result).toEqual({ message: 'Payment removed successfully.' });
  });
});