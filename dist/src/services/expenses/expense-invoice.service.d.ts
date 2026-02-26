import { MinioClientService } from 'src/services/tools/minio-client.service';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';
export declare class ExpenseInvoiceService {
    private readonly repo;
    private readonly minio;
    private readonly allowed;
    constructor(repo: ExpenseInvoiceRepository, minio: MinioClientService);
    upload(expenseId: string, file: Express.Multer.File): Promise<{
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
    getDownloadUrl(expenseId: string, invoiceId: string): Promise<{
        url: string;
    }>;
    remove(expenseId: string, invoiceId: string): Promise<void>;
}
