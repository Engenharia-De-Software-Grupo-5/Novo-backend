import { ConflictException, NotFoundException } from '@nestjs/common';
import { ChargeStatus } from '@prisma/client';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';

describe('ChargePaymentsRepository', () => {
  const prisma = {
    charges: { findFirst: jest.fn(), update: jest.fn() },
    payments: {
      findFirst: jest.fn(),
      aggregate: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  } as any;

  const repo = new ChargePaymentsRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('assertCharge should throw when charge not found', async () => {
    prisma.charges.findFirst.mockResolvedValue(null);
    await expect(repo.assertCharge('c1')).rejects.toThrow(new NotFoundException('Charge not found.'));
  });

  it('syncChargeStatus should update to PAID when sum >= amount', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date(Date.now() + 100000),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 100 } });

    await repo.syncChargeStatus('c1');

    expect(prisma.charges.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: ChargeStatus.PAID },
    });
  });

  it('createPayment should throw when charge is canceled', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 10,
      dueDate: new Date(),
      status: ChargeStatus.CANCELED,
    });

    await expect(
      repo.createPayment('c1', {
        amountPaid: 1,
        paymentDate: new Date(),
        method: 'PIX',
        calc: {
          wasLate: false,
          daysLate: 0,
          fineRate: 2,
          monthlyRate: 1,
          finePaid: 0,
          interestPaid: 0,
          totalPaid: 1,
        },
      }),
    ).rejects.toThrow(new ConflictException('Charge is canceled.'));
  });

  it('updatePayment should nullify proof fields when proof === null', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 10,
      dueDate: new Date(),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.findFirst.mockResolvedValue({ id: 'p1', proofObjectName: 'obj' });
    prisma.payments.update.mockResolvedValue({ id: 'p1' });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 0 } });

    const res = await repo.updatePayment('c1', 'p1', {
      amountPaid: 1,
      paymentDate: new Date('2026-01-01T00:00:00.000Z'),
      method: 'PIX',
      proof: null,
      calc: {
        wasLate: false,
        daysLate: 0,
        fineRate: 2,
        monthlyRate: 1,
        finePaid: 0,
        interestPaid: 0,
        totalPaid: 1,
      },
    });

    const call = prisma.payments.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'p1' });
    expect(call.data.proofObjectName).toBeNull();
    expect(call.data.proofOriginalName).toBeNull();
    expect(res).toEqual({ updated: { id: 'p1' }, previousProofObject: 'obj' });
  });

  it('softDeletePayment should set deletedAt and sync status', async () => {
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 10,
      dueDate: new Date(Date.now() + 100000),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.payments.update.mockResolvedValue({ id: 'p1' });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { amountPaid: 0 } });

    const res = await repo.softDeletePayment('c1', 'p1');

    expect(prisma.payments.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'p1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ message: 'Payment removed successfully.' });
  });
});