"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseInvoiceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let ExpenseInvoiceRepository = class ExpenseInvoiceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertExpenseExists(expenseId) {
        const exp = await this.prisma.expenses.findFirst({
            where: { id: expenseId, deletedAt: null },
            select: { id: true },
        });
        if (!exp)
            throw new common_1.NotFoundException('Expense not found.');
    }
    async create(input) {
        await this.assertExpenseExists(input.expenseId);
        return this.prisma.invoices.create({
            data: {
                expenseId: input.expenseId,
                objectName: input.objectName,
                originalName: input.originalName,
                mimeType: input.mimeType,
                extension: input.extension,
                size: input.size,
            },
        });
    }
    async list(expenseId) {
        await this.assertExpenseExists(expenseId);
        return this.prisma.invoices.findMany({
            where: { expenseId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneOrThrow(expenseId, invoiceId) {
        const inv = await this.prisma.invoices.findFirst({
            where: { id: invoiceId, expenseId, deletedAt: null },
        });
        if (!inv)
            throw new common_1.NotFoundException('Invoice not found.');
        return inv;
    }
    async softDelete(expenseId, invoiceId) {
        await this.findOneOrThrow(expenseId, invoiceId);
        await this.prisma.invoices.update({
            where: { id: invoiceId },
            data: { deletedAt: new Date() },
        });
        return { message: 'Invoice removed successfully.' };
    }
};
exports.ExpenseInvoiceRepository = ExpenseInvoiceRepository;
exports.ExpenseInvoiceRepository = ExpenseInvoiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseInvoiceRepository);
//# sourceMappingURL=expense-invoice.repository.js.map