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
    $transaction: jest.fn(),
  } as any;

  const repo = new ExpenseRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  const baseInput = {
    expenseType: 'MANUTENCAO',
    value: 10,
    expenseDate: new Date('2026-01-01T00:00:00.000Z'),
    paymentMethod: ExpensePaymentMethod.CASH,
  };

  it('create should throw when condominiumId and propertyId are provided together', async () => {
    await expect(
      repo.create({
        ...baseInput,
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: 'p1',
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'condominiumId and propertyId cannot be provided at the same time.',
      ),
    );
  });

  it('create should throw when targetType CONDOMINIUM but condominiumId missing', async () => {
    await expect(
      repo.create({
        ...baseInput,
        targetType: ExpenseTargetType.CONDOMINIUM,
      } as any),
    ).rejects.toThrow(new BadRequestException('condominiumId is required.'));
  });

  it('create should throw when condominium not found', async () => {
    prisma.condominiums.findFirst.mockResolvedValue(null);

    await expect(
      repo.create({
        ...baseInput,
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
      }),
    ).rejects.toThrow(new NotFoundException('Condominium not found.'));
  });

  it('create should create expense for CONDOMINIUM', async () => {
    prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });
    prisma.expenses.create.mockResolvedValue({ id: 'e1' });

    const res = await repo.create({
      ...baseInput,
      targetType: ExpenseTargetType.CONDOMINIUM,
      condominiumId: 'c1',
    });

    expect(prisma.expenses.create).toHaveBeenCalledWith({
      data: {
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: null,
        expenseType: baseInput.expenseType,
        value: baseInput.value,
        expenseDate: baseInput.expenseDate,
        paymentMethod: baseInput.paymentMethod,
      },
    });
    expect(res).toEqual({ id: 'e1' });
  });

  it('findAll should include non-deleted invoices and order by expenseDate desc', async () => {
    prisma.expenses.findMany.mockResolvedValue([{ id: 'e1' }]);

    const res = await repo.findAll();
    expect(prisma.expenses.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { expenseDate: 'desc' },
      include: { invoices: { where: { deletedAt: null } } },
    });
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('findByIdOrThrow should throw when not found', async () => {
    prisma.expenses.findFirst.mockResolvedValue(null);

    await expect(repo.findByIdOrThrow('e1')).rejects.toThrow(
      new NotFoundException('Expense not found.'),
    );
  });

  it('update should validate existence then update', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' });
    prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
    prisma.expenses.update.mockResolvedValue({ id: 'e1' });

    const res = await repo.update('e1', {
      ...baseInput,
      targetType: ExpenseTargetType.PROPERTY,
      propertyId: 'p1',
    } as any);

    expect(prisma.expenses.update).toHaveBeenCalledWith({
      where: { id: 'e1' },
      data: expect.objectContaining({
        targetType: ExpenseTargetType.PROPERTY,
        condominiumId: null,
        propertyId: 'p1',
      }),
    });
    expect(res).toEqual({ id: 'e1' });
  });

  it('softDelete should soft delete invoices and expense in a transaction', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' });

    const tx = {
      invoices: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      expenses: { update: jest.fn().mockResolvedValue({ id: 'e1' }) },
    };
    prisma.$transaction.mockImplementation(async (fn: any) => fn(tx));

    const res = await repo.softDelete('e1');

    expect(tx.invoices.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { expenseId: 'e1', deletedAt: null },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(tx.expenses.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'e1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
    expect(res).toEqual({ message: 'Expense removed successfully.' });
  });
});