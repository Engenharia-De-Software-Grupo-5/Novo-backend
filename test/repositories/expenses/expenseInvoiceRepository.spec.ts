import { NotFoundException } from '@nestjs/common';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';

describe('ExpenseInvoiceRepository', () => {
  const prisma = {
    expenses: { findFirst: jest.fn() },
    invoices: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  } as any;

  const repo = new ExpenseInvoiceRepository(prisma);

  afterEach(() => jest.clearAllMocks());

  it('create should throw when expense not found', async () => {
    prisma.expenses.findFirst.mockResolvedValue(null);
    await expect(repo.create({ expenseId: 'e1' } as any)).rejects.toThrow(
      new NotFoundException('Expense not found.'),
    );
  });

  it('list should query invoices when expense exists', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' });
    prisma.invoices.findMany.mockResolvedValue([{ id: 'i1' }]);

    const res = await repo.list('e1');
    expect(prisma.invoices.findMany).toHaveBeenCalledWith({
      where: { expenseId: 'e1', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('softDelete should set deletedAt and return message', async () => {
    prisma.invoices.findFirst.mockResolvedValue({ id: 'i1' });
    prisma.invoices.update.mockResolvedValue({ id: 'i1' });

    const res = await repo.softDelete('e1', 'i1');
    expect(prisma.invoices.update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(res).toEqual({ message: 'Invoice removed successfully.' });
  });
});