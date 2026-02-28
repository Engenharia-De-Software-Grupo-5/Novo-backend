import { NotFoundException } from '@nestjs/common';
import { ChargeStatus } from '@prisma/client';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';

describe('ChargesRepository', () => {
  const prisma = {
    tenants: { findFirst: jest.fn() },
    properties: { findFirst: jest.fn() },
    charges: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    payments: { aggregate: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should throw if tenant not found', async () => {
    prisma.tenants.findFirst.mockResolvedValue(null);
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });

    const repo = new ChargesRepository(prisma as any);

    await expect(
      repo.create('cond1', {
        tenantId: 't1',
        propertyId: 'p1',
        amount: 10,
        dueDate: '2026-02-10',
        paymentMethod: 'PIX',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('create should throw if property not found', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });
    prisma.properties.findFirst.mockResolvedValue(null);

    const repo = new ChargesRepository(prisma as any);

    await expect(
      repo.create('cond1', {
        tenantId: 't1',
        propertyId: 'p1',
        amount: 10,
        dueDate: '2026-02-10',
        paymentMethod: 'PIX',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('create should create with defaults and PENDING', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.charges.create.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ChargesRepository(prisma as any);

    const res = await repo.create('cond1', {
      tenantId: 't1',
      propertyId: 'p1',
      amount: 10,
      dueDate: '2026-02-10',
      paymentMethod: 'PIX',
    } as any);

    expect(prisma.charges.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fineRate: 2,
          monthlyRate: 1,
          status: ChargeStatus.PENDING,
          dueDate: new Date('2026-02-10'),
        }),
      }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('list should call findMany twice and try recompute for each charge', async () => {
    prisma.charges.findMany
      .mockResolvedValueOnce([{ id: 'c1' }, { id: 'c2' }] as any)
      .mockResolvedValueOnce([{ id: 'c1' }, { id: 'c2' }] as any);

    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 100,
      dueDate: new Date('2099-01-01'),
      status: ChargeStatus.PENDING,
    } as any);

    prisma.payments.aggregate.mockResolvedValue({ _sum: { totalPaid: 0 } });

    const repo = new ChargesRepository(prisma as any);
    const res = await repo.list({ tenantId: 't1' } as any);

    expect(prisma.charges.findMany).toHaveBeenCalledTimes(2);
    expect(res).toEqual([{ id: 'c1' }, { id: 'c2' }]);
  });

  it('findOne should throw NotFoundException when missing', async () => {
    prisma.charges.findFirst.mockResolvedValue(null);

    const repo = new ChargesRepository(prisma as any);
    await expect(repo.findOne('cond1', 'c1')).rejects.toThrow(NotFoundException);
  });

  it('update should call charges.update and recompute status', async () => {
    prisma.charges.findFirst
      .mockResolvedValueOnce({ id: 'c1', payments: [] } as any)
      .mockResolvedValueOnce({
        id: 'c1',
        amount: 100,
        dueDate: new Date('2099-01-01'),
        status: ChargeStatus.PENDING,
      } as any)
      .mockResolvedValueOnce({ id: 'c1', payments: [] } as any);

    prisma.payments.aggregate.mockResolvedValue({ _sum: { totalPaid: 0 } });
    prisma.charges.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ChargesRepository(prisma as any);
    const res = await repo.update('cond1', 'c1', { amount: 200 } as any);

    expect(prisma.charges.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'c1' }, data: { amount: 200 } }),
    );
    expect(res).toEqual({ id: 'c1' });
  });

  it('cancel should set status CANCELED', async () => {
    prisma.charges.findFirst.mockResolvedValue({ id: 'c1', payments: [] } as any);
    prisma.charges.update.mockResolvedValue({ id: 'c1' } as any);

    const repo = new ChargesRepository(prisma as any);
    const res = await repo.cancel('cond1', 'c1');

    expect(prisma.charges.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { status: ChargeStatus.CANCELED },
    });
    expect(res).toEqual({ id: 'c1' });
  });

  it('softDelete should mark deletedAt', async () => {
    prisma.charges.findFirst.mockResolvedValue({ id: 'c1', payments: [] } as any);
    prisma.charges.update.mockResolvedValue({} as any);

    const repo = new ChargesRepository(prisma as any);
    await repo.softDelete('cond1', 'c1');

    expect(prisma.charges.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'c1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
  });
});