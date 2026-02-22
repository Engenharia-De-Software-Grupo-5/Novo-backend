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
  } as any;

  const repo = new ChargesRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('create should throw when tenant not found', async () => {
    prisma.tenants.findFirst.mockResolvedValue(null);
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });

    await expect(repo.create({ tenantId: 't1', propertyId: 'p1' } as any)).rejects.toThrow(
      new NotFoundException('Tenant not found.'),
    );
  });

  it('create should call prisma.charges.create with defaults', async () => {
    prisma.tenants.findFirst.mockResolvedValue({ id: 't1' });
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.charges.create.mockResolvedValue({ id: 'c1' });

    const res = await repo.create({
      tenantId: 't1',
      propertyId: 'p1',
      amount: 100,
      dueDate: '2026-01-10',
      paymentMethod: 'PIX',
    } as any);

    expect(prisma.charges.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenantId: 't1',
        propertyId: 'p1',
        amount: 100,
        status: ChargeStatus.PENDING,
        fineRate: 2,
        monthlyRate: 1,
      }),
    });
    expect(res).toEqual({ id: 'c1' });
  });

  it('findOne should throw when charge not found', async () => {
    prisma.charges.findFirst.mockResolvedValueOnce(null);
    await expect(repo.findOne('c1')).rejects.toThrow(new NotFoundException('Charge not found.'));
  });

  it('list should query twice (after recompute)', async () => {
    prisma.charges.findMany
      .mockResolvedValueOnce([{ id: 'c1' }])
      .mockResolvedValueOnce([{ id: 'c1', status: ChargeStatus.PENDING }]);
    prisma.charges.findFirst.mockResolvedValue({
      id: 'c1',
      amount: 10,
      dueDate: new Date(Date.now() + 100000),
      status: ChargeStatus.PENDING,
    });
    prisma.payments.aggregate.mockResolvedValue({ _sum: { totalPaid: 0 } });

    const res = await repo.list();
    expect(prisma.charges.findMany).toHaveBeenCalledTimes(2);
    expect(res).toEqual([{ id: 'c1', status: ChargeStatus.PENDING }]);
  });
});