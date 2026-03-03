import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { buildDynamicWhere } from 'src/contracts/pagination/prisma.utils';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';

type CreateExpenseInput = {
  expensesFiles: Express.Multer.File[];
  targetType: ExpenseTargetType;
  condominiumId?: string;
  propertyId?: string;
  expenseType: string;
  description: string;
  value: number;
  expenseDate: Date;
  paymentMethod: ExpensePaymentMethod;
};

type UpdateExpenseInput = Omit<CreateExpenseInput, 'expensesFiles'> & {
  filesToKeep: string[]; // Lista de links dos arquivos que devem ser mantidos
  newFiles: Express.Multer.File[]; // Novos arquivos a serem adicionados
};

@Injectable()
export class ExpenseRepository {
  async getPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null },
      {
        enumFields: ['status'],
        customMappings: {
          permissionName: (content) => ({
            permission: { name: { contains: content, mode: 'insensitive' } },
          }),
        },
      },
    );

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.expenses.count({
        where,
      }),
      this.prisma.expenses.findMany({
        where,
        select: this.expenseSelect,
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / data.limit),
        page: data.page,
        limit: data.limit,
      },
    };
  }
  constructor(private readonly prisma: PrismaService) {}

  private async assertTargetExists(input: {
    targetType: ExpenseTargetType;
    condominiumId?: string;
    propertyId?: string;
  }) {
    const { targetType, condominiumId, propertyId } = input;

    if (condominiumId && propertyId) {
      throw new BadRequestException(
        'condominiumId and propertyId cannot be provided at the same time.',
      );
    }

    if (targetType === ExpenseTargetType.CONDOMINIUM) {
      if (!condominiumId)
        throw new BadRequestException('condominiumId is required.');

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

  private readonly expenseSelect = {
    description: true,
    id: true,
    propertyId: true,
    value: true,
    expenseType: true,
    expenseDate: true,
    paymentMethod: true,
    targetType: true,
    expenseFiles: {
      select: {
        id: true,
        link: true,
        name: true,
        type: true,
      },
    },
  };
  async create(
    input: CreateExpenseInput,
    uploadedFiles: { link: string; originalName: string; type: string }[],
  ) {
    const target = await this.assertTargetExists(input);

    const response = await this.prisma.expenses.create({
      data: {
        description: input.description,
        targetType: input.targetType,
        condominiumId: target.condominiumId,
        propertyId: target.propertyId,
        expenseType: input.expenseType,
        value: input.value,
        expenseDate: input.expenseDate,
        paymentMethod: input.paymentMethod,

        // Mapeia diretamente os dados passados pelo Service
        expenseFiles: {
          create: uploadedFiles.map((file) => ({
            link: file.link,
            name: file.originalName,
            type: file.type, // Salva o tipo real (ex: 'application/pdf', 'image/jpeg')
          })),
        },
      },
      include: { expenseFiles: true },
    });

    return response;
  }

  getAll(): Promise<ExpenseResponse[]> {
    // A query deve ser na tabela de expenses!
    return this.prisma.expenses.findMany({
      where: { deletedAt: null },
      select: this.expenseSelect,
    }) as any;
  }

  async findByIdOrThrow(id: string): Promise<ExpenseResponse> {
    const exp = await this.prisma.expenses.findFirst({
      where: { id, deletedAt: null },
      select: this.expenseSelect,
    });

    if (!exp) throw new NotFoundException('Expense not found.');
    return exp;
  }

  async update(
    id: string,
    input: Omit<UpdateExpenseInput, 'newFiles'>,
    uploadedFiles: {
      link: string;
      originalName: string;
      type: string;
    }[],
  ) {
    const existing = await this.prisma.expenses.findUnique({
      where: { id },
      include: { expenseFiles: true },
    });

    if (!existing) {
      throw new NotFoundException('Expense not found');
    }

    // 1️⃣ Descobrir quais arquivos devem ser deletados
    const filesToDelete = existing.expenseFiles
      .filter(
        (file) => !input.filesToKeep || !input.filesToKeep.includes(file.id), // 🔥 comparar por ID
      )
      .map((file) => file.id);

    return this.prisma.expenses.update({
      where: { id },
      data: {
        description: input.description,
        targetType: existing.targetType,
        condominiumId: existing.condominiumId,
        propertyId: existing.propertyId,
        expenseType: input.expenseType,
        value: input.value,
        expenseDate: input.expenseDate,
        paymentMethod: input.paymentMethod,

        expenseFiles: {
          // 2️⃣ Deleta somente os realmente necessários
          deleteMany: {
            id: { in: filesToDelete },
          },

          // 3️⃣ Cria os novos
          create: uploadedFiles.map((file) => ({
            link: file.link,
            name: file.originalName,
            type: file.type,
          })),
        },
      },
      include: { expenseFiles: true },
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
