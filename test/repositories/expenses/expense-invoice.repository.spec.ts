import { NotFoundException } from '@nestjs/common';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';

describe('ExpenseInvoiceRepository', () => {
  const prisma = {
    expenses: {
      findFirst: jest.fn(),
    },
    invoices: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('assertExpenseExists should throw NotFoundException when expense not found', async () => {
    prisma.expenses.findFirst.mockResolvedValue(null);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    await expect(repo.assertExpenseExists('e1')).rejects.toThrow(NotFoundException);

    expect(prisma.expenses.findFirst).toHaveBeenCalledWith({
      where: { id: 'e1', deletedAt: null },
      select: { id: true },
    });
  });

  it('create should assert expense exists then create invoice', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' } as any);
    prisma.invoices.create.mockResolvedValue({ id: 'i1' } as any);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    const res = await repo.create({
      expenseId: 'e1',
      objectName: 'obj.pdf',
      originalName: 'inv.pdf',
      mimeType: 'application/pdf',
      extension: 'pdf',
      size: 10,
    });

    expect(prisma.invoices.create).toHaveBeenCalledWith({
      data: {
        expenseId: 'e1',
        objectName: 'obj.pdf',
        originalName: 'inv.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 10,
      },
    });

    expect(res).toEqual({ id: 'i1' });
  });

  it('list should assert expense exists then list invoices ordered by createdAt desc', async () => {
    prisma.expenses.findFirst.mockResolvedValue({ id: 'e1' } as any);
    prisma.invoices.findMany.mockResolvedValue([{ id: 'i1' }] as any);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    const res = await repo.list('e1');

    expect(prisma.invoices.findMany).toHaveBeenCalledWith({
      where: { expenseId: 'e1', deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('findOneOrThrow should throw NotFoundException when invoice not found', async () => {
    prisma.invoices.findFirst.mockResolvedValue(null);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    await expect(repo.findOneOrThrow('e1', 'i1')).rejects.toThrow(NotFoundException);

    expect(prisma.invoices.findFirst).toHaveBeenCalledWith({
      where: { id: 'i1', expenseId: 'e1', deletedAt: null },
    });
  });

  it('findOneOrThrow should return invoice when found', async () => {
    prisma.invoices.findFirst.mockResolvedValue({ id: 'i1' } as any);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    const res = await repo.findOneOrThrow('e1', 'i1');

    expect(res).toEqual({ id: 'i1' });
  });

  it('softDelete should find invoice then update deletedAt and return message', async () => {
    prisma.invoices.findFirst.mockResolvedValue({ id: 'i1' } as any);
    prisma.invoices.update.mockResolvedValue({} as any);

    const repo = new ExpenseInvoiceRepository(prisma as any);

    const res = await repo.softDelete('e1', 'i1');

    expect(prisma.invoices.update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: { deletedAt: expect.any(Date) },
    });

    expect(res).toEqual({ message: 'Invoice removed successfully.' });
  });
});