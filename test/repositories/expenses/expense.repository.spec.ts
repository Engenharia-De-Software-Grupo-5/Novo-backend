import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';

describe('ExpenseRepository', () => {
  let repo: ExpenseRepository;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(),
      expenses: {
        count: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      condominiums: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      properties: {
        findFirst: jest.fn(),
      },
      invoices: {
        updateMany: jest.fn(),
      },
    };

    repo = new ExpenseRepository(prisma);
  });

  describe('getPaginated', () => {
    it('should return items and meta', async () => {
      prisma.$transaction.mockResolvedValue([3, [{ id: 'ex1' }, { id: 'ex2' }]]);

      const res = await repo.getPaginated({ page: 1, limit: 2 } as any);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(res.items).toHaveLength(2);
      expect(res.meta.page).toBe(1);
      expect(res.meta.limit).toBe(2);
      expect(res.meta.totalItems).toBe(3);
      expect(res.meta.totalPages).toBe(2);
    });
  });

  describe('create / assertTargetExists', () => {
    it('should throw when condominiumId and propertyId are provided together', async () => {
      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'CONDOMINIUM' as any,
            condominiumId: 'c1',
            propertyId: 'p1',
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw when targetType=CONDOMINIUM and condominiumId is missing', async () => {
      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'CONDOMINIUM' as any,
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw NotFoundException when condominium does not exist', async () => {
      prisma.condominiums.findFirst.mockResolvedValue(null);

      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'CONDOMINIUM' as any,
            condominiumId: 'c1',
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should create expense when targetType=CONDOMINIUM and condo exists', async () => {
      prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });

      prisma.expenses.create.mockResolvedValue({ id: 'ex1' });

      const input = {
        expensesFiles: [{ originalname: 'a.pdf' }, { originalname: 'b.pdf' }] as any,
        targetType: 'CONDOMINIUM' as any,
        condominiumId: 'c1',
        expenseType: 'X',
        description: 'd',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: 'PIX' as any,
      } as any;

      const res = await repo.create(input, ['k1', 'k2']);

      expect(prisma.expenses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            condominiumId: 'c1',
            propertyId: null,
            expenseFiles: {
              create: [
                { link: 'k1', name: 'a.pdf', type: null },
                { link: 'k2', name: 'b.pdf', type: null },
              ],
            },
          }),
          include: { expenseFiles: true },
        }),
      );

      expect(res).toEqual({ id: 'ex1' });
    });

    it('should throw when targetType=PROPERTY and propertyId missing', async () => {
      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'PROPERTY' as any,
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw NotFoundException when property does not exist', async () => {
      prisma.properties.findFirst.mockResolvedValue(null);

      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'PROPERTY' as any,
            propertyId: 'p1',
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should create expense when targetType=PROPERTY and property exists', async () => {
      prisma.properties.findFirst.mockResolvedValue({ id: 'p1' });
      prisma.expenses.create.mockResolvedValue({ id: 'ex1' });

      const input = {
        expensesFiles: [{ originalname: 'a.pdf' }] as any,
        targetType: 'PROPERTY' as any,
        propertyId: 'p1',
        expenseType: 'X',
        description: 'd',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: 'PIX' as any,
      } as any;

      const res = await repo.create(input, ['k1']);

      expect(prisma.expenses.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            condominiumId: null,
            propertyId: 'p1',
          }),
        }),
      );

      expect(res).toEqual({ id: 'ex1' });
    });

    it('should throw BadRequestException targetType invalid for unknown enum (e.g. EMPLOYEE)', async () => {
      prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' });

      await expect(
        repo.create(
          {
            expensesFiles: [],
            targetType: 'EMPLOYEE' as any,
            condominiumId: 'c1',
            expenseType: 'X',
            description: 'd',
            value: 10,
            expenseDate: new Date(),
            paymentMethod: 'PIX' as any,
          } as any,
          [],
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getAll', () => {
    it('should call prisma.condominiums.findMany (current implementation)', async () => {
      prisma.condominiums.findMany.mockResolvedValue([{ id: 'ex1' }]);

      const res = await repo.getAll();

      expect(prisma.condominiums.findMany).toHaveBeenCalled();
      expect(res).toEqual([{ id: 'ex1' }]);
    });
  });

  describe('findByIdOrThrow', () => {
    it('should throw NotFoundException when not found', async () => {
      prisma.expenses.findFirst.mockResolvedValue(null);

      await expect(repo.findByIdOrThrow('ex1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return expense when found', async () => {
      prisma.expenses.findFirst.mockResolvedValue({ id: 'ex1' });

      const res = await repo.findByIdOrThrow('ex1');

      expect(res).toEqual({ id: 'ex1' });
    });
  });

  describe('update', () => {
    it('should update after validating expense exists and target exists', async () => {
      prisma.expenses.findFirst.mockResolvedValue({ id: 'ex1' }); // findByIdOrThrow
      prisma.condominiums.findFirst.mockResolvedValue({ id: 'c1' }); // target exists

      prisma.expenses.update.mockResolvedValue({ id: 'ex1' });

      const input = {
        filesToKeep: ['keep1'],
        newFiles: [{ originalname: 'n1.pdf' }] as any,
        targetType: 'CONDOMINIUM' as any,
        condominiumId: 'c1',
        expenseType: 'X',
        description: 'd',
        value: 10,
        expenseDate: new Date(),
        paymentMethod: 'PIX' as any,
      } as any;

      const res = await repo.update('ex1', input, ['newK1']);

      expect(prisma.expenses.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ex1' },
          data: expect.objectContaining({
            condominiumId: 'c1',
            propertyId: null,
            expenseFiles: expect.objectContaining({
              deleteMany: { link: { notIn: ['keep1'] } },
              create: [{ link: 'newK1', name: 'n1.pdf', type: null }],
            }),
          }),
        }),
      );

      expect(res).toEqual({ id: 'ex1' });
    });
  });

  describe('softDelete', () => {
    it('should soft delete invoices and expense and return message', async () => {
      prisma.expenses.findFirst.mockResolvedValue({ id: 'ex1' }); // findByIdOrThrow

      prisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          invoices: { updateMany: prisma.invoices.updateMany },
          expenses: { update: prisma.expenses.update },
        };
        prisma.invoices.updateMany.mockResolvedValue({ count: 1 });
        prisma.expenses.update.mockResolvedValue({ id: 'ex1' });
        return fn(tx);
      });

      const res = await repo.softDelete('ex1');

      expect(prisma.invoices.updateMany).toHaveBeenCalled();
      expect(prisma.expenses.update).toHaveBeenCalled();
      expect(res).toEqual({ message: 'Expense removed successfully.' });
    });
  });
});