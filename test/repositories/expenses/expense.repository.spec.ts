import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';

describe('ExpenseRepository', () => {
  const prisma = {
    condominiums: { findFirst: jest.fn() },
    properties: { findFirst: jest.fn() },
    expenses: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    invoices: { updateMany: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should throw when condominiumId and propertyId are both provided', async () => {
    const repo = new ExpenseRepository(prisma as any);

    await expect(
      repo.create({
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: 'p1',
        expenseType: 'X',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.PIX,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('create should throw when targetType is CONDOMINIUM and condominiumId missing', async () => {
    const repo = new ExpenseRepository(prisma as any);

    await expect(
      repo.create({
        targetType: ExpenseTargetType.CONDOMINIUM,
        expenseType: 'X',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.PIX,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('create should throw when targetType is PROPERTY and propertyId missing', async () => {
    const repo = new ExpenseRepository(prisma as any);

    await expect(
      repo.create({
        targetType: ExpenseTargetType.PROPERTY,
        expenseType: 'X',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.PIX,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('create should throw NotFoundException when condominium does not exist', async () => {
    prisma.condominiums.findFirst.mockResolvedValue(null);

    const repo = new ExpenseRepository(prisma as any);

    await expect(
      repo.create({
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        expenseType: 'X',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.PIX,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('create should call prisma.expenses.create (CONDOMINIUM target)', async () => {
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' } as any);
    prisma.expenses.create.mockResolvedValue({ id: 'e1' } as any);

    const repo = new ExpenseRepository(prisma as any);
    const dt = new Date('2026-02-01');

    const res = await repo.create({
      targetType: ExpenseTargetType.CONDOMINIUM,
      condominiumId: 'c1',
      expenseType: 'WATER',
      value: 123,
      expenseDate: dt,
      paymentMethod: ExpensePaymentMethod.PIX,
    } as any);

    expect(prisma.expenses.create).toHaveBeenCalledWith({
      data: {
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: null,
        expenseType: 'WATER',
        value: 123,
        expenseDate: dt,
        paymentMethod: ExpensePaymentMethod.PIX,
      },
    });

    expect(res).toEqual({ id: 'e1' });
  });

  it('create should call prisma.expenses.create (PROPERTY target)', async () => {
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' } as any);
    prisma.expenses.create.mockResolvedValue({ id: 'e1' } as any);

    const repo = new ExpenseRepository(prisma as any);
    const dt = new Date('2026-02-01');

    const res = await repo.create({
      targetType: ExpenseTargetType.PROPERTY,
      propertyId: 'p1',
      expenseType: 'REPAIR',
      value: 50,
      expenseDate: dt,
      paymentMethod: ExpensePaymentMethod.BOLETO,
    } as any);

    expect(prisma.expenses.create).toHaveBeenCalledWith({
      data: {
        targetType: ExpenseTargetType.PROPERTY,
        condominiumId: null,
        propertyId: 'p1',
        expenseType: 'REPAIR',
        value: 50,
        expenseDate: dt,
        paymentMethod: ExpensePaymentMethod.BOLETO,
      },
    });

    expect(res).toEqual({ id: 'e1' });
  });

  it('findAll should list expenses (not deleted) with invoices filter', async () => {
    prisma.expenses.findMany.mockResolvedValue([{ id: 'e1' }] as any);

    const repo = new ExpenseRepository(prisma as any);
    const res = await repo.findAll();

    expect(prisma.expenses.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { expenseDate: 'desc' },
      include: { invoices: { where: { deletedAt: null } } },
    });

    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('findByIdOrThrow should throw when expense not found', async () => {
    prisma.expenses.findFirst.mockResolvedValue(null);

    const repo = new ExpenseRepository(prisma as any);

    await expect(repo.findByIdOrThrow('e1')).rejects.toThrow(NotFoundException);
  });

  it('findByIdOrThrow should return expense when found', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' } as any);

    const repo = new ExpenseRepository(prisma as any);
    const res = await repo.findByIdOrThrow('e1');

    expect(prisma.expenses.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
      include: { invoices: { where: { deletedAt: null } } },
    });

    expect(res).toEqual({ id: 'e1' });
  });

  it('update should call findByIdOrThrow then update expense', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' } as any); // findByIdOrThrow ok
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' } as any); // target exists
    prisma.expenses.update.mockResolvedValue({ id: 'e1' } as any);

    const repo = new ExpenseRepository(prisma as any);
    const dt = new Date('2026-02-02');

    const res = await repo.update('e1', {
      targetType: ExpenseTargetType.CONDOMINIUM,
      condominiumId: 'c1',
      expenseType: 'X',
      value: 1,
      expenseDate: dt,
      paymentMethod: ExpensePaymentMethod.PIX,
    } as any);

    expect(prisma.expenses.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: {
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: null,
        expenseType: 'X',
        value: 1,
        expenseDate: dt,
        paymentMethod: ExpensePaymentMethod.PIX,
      },
    });

    expect(res).toEqual({ id: 'e1' });
  });

  it('softDelete should transactionally soft delete invoices then expense', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' } as any); // findByIdOrThrow ok

    const tx = {
      invoices: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      expenses: { update: jest.fn().mockResolvedValue({ id: 'e1' }) },
    };

    prisma.$transaction.mockImplementation(async (fn: any) => fn(tx));

    const repo = new ExpenseRepository(prisma as any);

    const res = await repo.softDelete('e1');

    expect(tx.invoices.updateMany).toHaveBeenCalledWith({
      where: { expenseId: 'e1', deletedAt: null },
      data: { deletedAt: expect.any(Date) },
    });

    expect(tx.expenses.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: { deletedAt: expect.any(Date) },
    });

    expect(res).toEqual({ message: 'Expense removed successfully.' });
  });
});