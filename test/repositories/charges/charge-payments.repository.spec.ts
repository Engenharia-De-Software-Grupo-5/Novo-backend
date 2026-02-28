import { ConflictException, NotFoundException } from '@nestjs/common';
import { ChargeStatus } from '@prisma/client';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';

describe('ChargePaymentsRepository', () => {
  const prisma = {
    charges: { findFirst: jest.fn(), update: jest.fn() },
    payments: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assertCharge should throw NotFoundException when missing', async () => {
    prisma.charges.findFirst.mockResolvedValue(null);

    const repo = new ChargePaymentsRepository(prisma as any);
    await expect(repo.assertCharge('cond1', 'c1')).rejects.toThrow(NotFoundException);
  });

  it('assertPayment should throw NotFoundException when missing', async () => {
    prisma.payments.findFirst.mockResolvedValue(null);

    const repo = new ChargePaymentsRepository(prisma as any);
    await expect(repo.assertPayment('cond1', 'c1', 'p1')).rejects.toThrow(NotFoundException);
  });

  it('syncChargeStatus should not change when status is CANCELED', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.CANCELED,
    });

    const repo = new ChargePaymentsRepository(prisma as any);
    await repo.syncChargeStatus('cond1', 'c1');

    expect(prisma.payments.aggregate).not.toHaveBeenCalled();
    expect(prisma.charges.update).not.toHaveBeenCalled();
  });

  it('syncChargeStatus should set PAID when sum(amountPaid) >= amount', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 120 } });

    const repo = new ChargePaymentsRepository(prisma as any);
    await repo.syncChargeStatus('cond1', 'c1');

    expect(prisma.charges.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: ChargeStatus.PAID },
    });
  });

  it('syncChargeStatus should set OVERDUE when overdue and not paid', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-02-20').getTime());

    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2026-02-10'),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 0 } });

    const repo = new ChargePaymentsRepository(prisma as any);
    await repo.syncChargeStatus('cond1', 'c1');

    expect(prisma.charges.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: ChargeStatus.OVERDUE },
    });

    (Date.now as any).mockRestore?.();
  });

  it('createPayment should throw ConflictException if charge CANCELED', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date(),
      status: ChargeStatus.CANCELED,
    });

    const repo = new ChargePaymentsRepository(prisma as any);

    await expect(
      repo.createPayment('cond1', 'c1', {
        amountPaid: 10,
        paymentDate: new Date(),
        method: 'PIX',
        calc: {
          wasLate: false,
          daysLate: 0,
          fineRate: 0,
          monthlyRate: 0,
          finePaid: 0,
          interestPaid: 0,
          totalPaid: 10,
        },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('createPayment should create and then sync status', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.create.mockResolvedValue({ id: 'p1', proofObjectName: null } as any);
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 10 } });

    const repo = new ChargePaymentsRepository(prisma as any);

    const res = await repo.createPayment('cond1', 'c1', {
      amountPaid: 10,
      paymentDate: new Date('2026-02-18'),
      method: 'PIX',
      calc: {
        wasLate: false,
        daysLate: 0,
        fineRate: 0.02,
        monthlyRate: 0.01,
        finePaid: 0,
        interestPaid: 0,
        totalPaid: 10,
      },
      proof: {
        objectName: 'obj.pdf',
        originalName: 'proof.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 10,
      },
    });

    expect(prisma.payments.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 'p1', proofObjectName: null });

    expect(prisma.payments.aggregate).toHaveBeenCalled();
  });

  it('updatePayment should clear proof fields when data.proof === null', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.findFirst.mockResolvedValue({ id: 'p1', proofObjectName: 'old.pdf' } as any);
    prisma.payments.update.mockResolvedValue({ id: 'p1' } as any);
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 0 } });

    const repo = new ChargePaymentsRepository(prisma as any);

    const out = await repo.updatePayment('cond1', 'c1', 'p1', {
      amountPaid: 10,
      paymentDate: new Date(),
      method: 'PIX',
      calc: {
        wasLate: false,
        daysLate: 0,
        fineRate: 0,
        monthlyRate: 0,
        finePaid: 0,
        interestPaid: 0,
        totalPaid: 10,
      },
      proof: null,
    });

    expect(prisma.payments.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1' },
        data: expect.objectContaining({
          proofObjectName: null,
          proofOriginalName: null,
          proofMimeType: null,
          proofExtension: null,
          proofSize: null,
        }),
      }),
    );
    expect(out).toEqual({ updated: { id: 'p1' }, previousProofObject: 'old.pdf' });
  });

  it('softDeletePayment should mark deletedAt and sync', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.findFirst.mockResolvedValue({ id: 'p1' } as any);
    prisma.payments.update.mockResolvedValue({} as any);
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 0 } });

    const repo = new ChargePaymentsRepository(prisma as any);

    const res = await repo.softDeletePayment('cond1', 'p1', 'c1');

    expect(prisma.payments.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ message: 'Payment removed successfully.' });
  });
});