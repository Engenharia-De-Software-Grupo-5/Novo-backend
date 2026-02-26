import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';
export declare class ExpenseInvoiceController {
    private readonly service;
    constructor(service: ExpenseInvoiceService);
    upload(expenseId: string, file?: Express.Multer.File): Promise<{
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
    findOne(expenseId: string, invoiceId: string): Promise<{
        url: string;
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
    download(expenseId: string, invoiceId: string): Promise<{
        url: string;
    }>;
    remove(expenseId: string, invoiceId: string): Promise<void>;
}
