import { PrismaService } from 'src/common/database/prisma.service';
type CreateExpenseInvoiceInput = {
    expenseId: string;
    objectName: string;
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
};
export declare class ExpenseInvoiceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertExpenseExists(expenseId: string): Promise<void>;
    create(input: CreateExpenseInvoiceInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        expenseId: string;
    }>;
    list(expenseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        expenseId: string;
    }[]>;
    findOneOrThrow(expenseId: string, invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
        expenseId: string;
    }>;
    softDelete(expenseId: string, invoiceId: string): Promise<{
        message: string;
    }>;
}
export {};
