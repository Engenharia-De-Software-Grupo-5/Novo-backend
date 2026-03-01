// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/common/database/prisma.service';

// type CreateExpenseInvoiceInput = {
//   expenseId: string;
//   objectName: string;
//   originalName: string;
//   mimeType: string;
//   extension: string;
//   size: number;
// };

// @Injectable()
// export class ExpenseInvoiceRepository {
//   constructor(private readonly prisma: PrismaService) {}

//   async assertExpenseExists(expenseId: string) {
//     const exp = await this.prisma.expenses.findFirst({
//       where: { id: expenseId, deletedAt: null },
//       select: { id: true },
//     });
//     if (!exp) throw new NotFoundException('Expense not found.');
//   }

//   async create(input: CreateExpenseInvoiceInput) {
//     await this.assertExpenseExists(input.expenseId);

//     return this.prisma.invoices.create({
//       data: {
//         expenseId: input.expenseId,
//         objectName: input.objectName,
//         originalName: input.originalName,
//         mimeType: input.mimeType,
//         extension: input.extension,
//         size: input.size,
//       },
//     });
//   }

//   async list(expenseId: string) {
//     await this.assertExpenseExists(expenseId);

//     return this.prisma.invoices.findMany({
//       where: { expenseId, deletedAt: null },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async findOneOrThrow(expenseId: string, invoiceId: string) {

//     const inv = await this.prisma.invoices.findFirst({
//       where: { id: invoiceId, expenseId, deletedAt: null },
//     });

//     if (!inv) throw new NotFoundException('Invoice not found.');
//     return inv;
//   }

//   async softDelete(expenseId: string, invoiceId: string) {

//     await this.findOneOrThrow(expenseId, invoiceId);

//     await this.prisma.invoices.update({
//       where: { id: invoiceId },
//       data: { deletedAt: new Date() },
//     });

//     return { message: 'Invoice removed successfully.' };
//   }
// }