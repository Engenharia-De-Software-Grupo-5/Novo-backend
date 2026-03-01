import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';

describe('ExpenseRepository', () => {
  let repo: ExpenseRepository;

  const prisma = {
    condominiums: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    properties: {
      findFirst: jest.fn(),
    },
    expenses: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    invoices: {
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const makeFile = (name = 'file.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 123,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ExpenseRepository(prisma as any);
  });

  describe('create', () => {
    it('should call prisma.expenses.create when targetType is CONDOMINIUM and condominium exists', async () => {
      prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });

      const input = {
        expensesFiles: [makeFile('a.pdf')],
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        expenseType: 'WATER',
        description: 'Conta de água',
        value: 100,
        expenseDate: new Date('2026-01-01'),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      prisma.expenses.create.mockResolvedValue({
        id: 'ex1',
        ...input,
        propertyId: null,
        expenseFiles: [{ id: 'f1', link: 'link1', name: 'a.pdf', type: null }],
      });

      const res = await repo.create(input as any, ['link1']);

      expect(prisma.condominiums.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1', deletedAt: null },
          select: { id: true },
        }),
      );

      expect(prisma.expenses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetType: ExpenseTargetType.CONDOMINIUM,
            condominiumId: 'c1',
            propertyId: null,
            expenseType: 'WATER',
            description: 'Conta de água',
            value: 100,
            paymentMethod: ExpensePaymentMethod.CASH,
            expenseFiles: {
              create: [
                expect.objectContaining({
                  link: 'link1',
                  name: 'a.pdf',
                  type: null,
                }),
              ],
            },
          }),
          include: { expenseFiles: true },
        }),
      );

      expect(res).toHaveProperty('id', 'ex1');
    });

    it('should call prisma.expenses.create when targetType is PROPERTY and property exists', async () => {
      prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });

      const input = {
        expensesFiles: [makeFile('b.pdf')],
        targetType: ExpenseTargetType.PROPERTY,
        propertyId: 'p1',
        expenseType: 'MAINTENANCE',
        description: 'Manutenção',
        value: 250,
        expenseDate: new Date('2026-02-01'),
        paymentMethod: ExpensePaymentMethod.PIX,
      };

      prisma.expenses.create.mockResolvedValue({
        id: 'ex2',
        ...input,
        condominiumId: null,
        expenseFiles: [{ id: 'f2', link: 'link2', name: 'b.pdf', type: null }],
      });

      const res = await repo.create(input as any, ['link2']);

      expect(prisma.properties.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'p1', deletedAt: null },
          select: { id: true },
        }),
      );

      expect(prisma.expenses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetType: ExpenseTargetType.PROPERTY,
            propertyId: 'p1',
            condominiumId: null,
            expenseFiles: {
              create: [
                expect.objectContaining({
                  link: 'link2',
                  name: 'b.pdf',
                  type: null,
                }),
              ],
            },
          }),
          include: { expenseFiles: true },
        }),
      );

      expect(res).toHaveProperty('id', 'ex2');
    });

    it('should throw when condominiumId and propertyId are both provided', async () => {
      const input = {
        expensesFiles: [makeFile()],
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c1',
        propertyId: 'p1',
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });

    it('should throw when targetType is CONDOMINIUM but condominiumId is missing', async () => {
      const input = {
        expensesFiles: [makeFile()],
        targetType: ExpenseTargetType.CONDOMINIUM,
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.condominiums.findFirst).not.toHaveBeenCalled();
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });

    it('should throw when targetType is PROPERTY but propertyId is missing', async () => {
      const input = {
        expensesFiles: [makeFile()],
        targetType: ExpenseTargetType.PROPERTY,
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.properties.findFirst).not.toHaveBeenCalled();
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when CONDOMINIUM target does not exist', async () => {
      prisma.condominiums.findFirst.mockResolvedValue(null);

      const input = {
        expensesFiles: [makeFile()],
        targetType: ExpenseTargetType.CONDOMINIUM,
        condominiumId: 'c404',
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when PROPERTY target does not exist', async () => {
      prisma.properties.findFirst.mockResolvedValue(null);

      const input = {
        expensesFiles: [makeFile()],
        targetType: ExpenseTargetType.PROPERTY,
        propertyId: 'p404',
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when targetType is invalid', async () => {

      const input = {
        expensesFiles: [makeFile()],
        targetType: 'EMPLOYEE' as any,
        condominiumId: 'c1',
        expenseType: 'X',
        description: 'Y',
        value: 1,
        expenseDate: new Date(),
        paymentMethod: ExpensePaymentMethod.CASH,
      };

      await expect(repo.create(input as any, ['link'])).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.expenses.create).not.toHaveBeenCalled();
    });
  });
});