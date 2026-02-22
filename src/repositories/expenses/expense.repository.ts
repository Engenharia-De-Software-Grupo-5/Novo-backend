import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';

type CreateExpenseInput = {
  targetType: ExpenseTargetType;
  condominiumId?: string;
  propertyId?: string;
  expenseType: string;
  value: number;
  expenseDate: Date;
  paymentMethod: ExpensePaymentMethod;
};

@Injectable()
export class ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async assertTargetExists(input: {
    targetType: ExpenseTargetType;
    condominiumId?: string;
    propertyId?: string;
  }): Promise<{ condominiumId?: string; propertyId?: string }> {
    const { targetType, condominiumId, propertyId } = input;

    if (condominiumId && propertyId) {
      throw new BadRequestException('condominiumId and propertyId cannot be provided at the same time.');
    }

    if (targetType === ExpenseTargetType.CONDOMINIUM) {
      if (!condominiumId) throw new BadRequestException('condominiumId is required.');

      const condo = await this.prisma.condominiums.findFirst({
        where: { id: condominiumId, deletedAt: null },
        select: { id: true },
      });
      if (!condo) throw new NotFoundException('Condominium not found.');

      return { condominiumId, propertyId: null };
    }

    if (targetType === ExpenseTargetType.PROPERTY) {
      if (!propertyId) throw new BadRequestException('propertyId is required.');

      const prop = await this.prisma.properties.findFirst({
        where: { id: propertyId, deletedAt: null },
        select: { id: true },
      });
      if (!prop) throw new NotFoundException('Property not found.');

      return { propertyId, condominiumId: null };
    }

    throw new BadRequestException('targetType invalid.');
  }

  async create(input: CreateExpenseInput) {
    const target = await this.assertTargetExists(input);

    return this.prisma.expenses.create({
      data: {
        targetType: input.targetType,
        condominiumId: target.condominiumId,
        propertyId: target.propertyId,
        expenseType: input.expenseType,
        value: input.value,
        expenseDate: input.expenseDate,
        paymentMethod: input.paymentMethod,
      },
    });
  }

  findAll() {
    return this.prisma.expenses.findMany({
      where: { deletedAt: null },
      orderBy: { expenseDate: 'desc' },
      include: { invoices: { where: { deletedAt: null } } }, // útil pro front
    });
  }

  async findByIdOrThrow(id: string) {
    const exp = await this.prisma.expenses.findFirst({
      where: { id, deletedAt: null },
      include: { invoices: { where: { deletedAt: null } } },
    });

    if (!exp) throw new NotFoundException('Expense not found.');
    return exp;
  }

  async update(id: string, input: CreateExpenseInput) {
    await this.findByIdOrThrow(id);

    const target = await this.assertTargetExists(input);

    return this.prisma.expenses.update({
      where: { id },
      data: {
        targetType: input.targetType,
        condominiumId: target.condominiumId,
        propertyId: target.propertyId,
        expenseType: input.expenseType,
        value: input.value,
        expenseDate: input.expenseDate,
        paymentMethod: input.paymentMethod,
      },
    });
  }

 
  async softDelete(id: string) {
    await this.findByIdOrThrow(id);

    return this.prisma.$transaction(async (tx) => {
      await tx.invoices.updateMany({
        where: { expenseId: id, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      await tx.expenses.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return { message: 'Expense removed successfully.' };
    });
  }
}