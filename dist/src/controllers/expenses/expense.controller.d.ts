import { ExpenseDto } from 'src/contracts/expenses/expense.dto';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ExpenseService } from 'src/services/expenses/expense.service';
export declare class ExpenseController {
    private readonly service;
    constructor(service: ExpenseService);
    create(dto: ExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        condominiumId: string | null;
        value: number;
        propertyId: string | null;
        targetType: import(".prisma/client").$Enums.ExpenseTargetType;
        expenseType: string;
        expenseDate: Date;
        paymentMethod: import(".prisma/client").$Enums.ExpensePaymentMethod;
    }>;
    list(): import(".prisma/client").Prisma.PrismaPromise<({
        invoices: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        condominiumId: string | null;
        value: number;
        propertyId: string | null;
        targetType: import(".prisma/client").$Enums.ExpenseTargetType;
        expenseType: string;
        expenseDate: Date;
        paymentMethod: import(".prisma/client").$Enums.ExpensePaymentMethod;
    })[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ExpenseResponse>>;
    findOne(id: string): Promise<{
        invoices: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        condominiumId: string | null;
        value: number;
        propertyId: string | null;
        targetType: import(".prisma/client").$Enums.ExpenseTargetType;
        expenseType: string;
        expenseDate: Date;
        paymentMethod: import(".prisma/client").$Enums.ExpensePaymentMethod;
    }>;
    update(id: string, dto: ExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        condominiumId: string | null;
        value: number;
        propertyId: string | null;
        targetType: import(".prisma/client").$Enums.ExpenseTargetType;
        expenseType: string;
        expenseDate: Date;
        paymentMethod: import(".prisma/client").$Enums.ExpensePaymentMethod;
    }>;
    remove(id: string): Promise<void>;
}
