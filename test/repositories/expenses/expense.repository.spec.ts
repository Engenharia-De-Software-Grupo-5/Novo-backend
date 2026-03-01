import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';

describe('ExpenseRepository', () => {
  const prisma = {
    expenses: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    expenseAttachment: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },

    // mocks “genéricos” para assertTargetExists não quebrar
    tenants: { findFirst: jest.fn() },
    properties: { findFirst: jest.fn() },
    employees: { findFirst: jest.fn() },
    condominiums: { findFirst: jest.fn() },
  };

  const repo = new ExpenseRepository(prisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should throw BadRequestException when targetType invalid', async () => {
    await expect(
      repo.create({ targetType: 'INVALID' } as any, []),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('update should throw when findByIdOrThrow cannot find expense', async () => {
    prisma.expenses.findFirst.mockResolvedValue(null);

    await expect(repo.update('e1', {} as any, [])).rejects.toBeInstanceOf(
  NotFoundException,
);
  });
});