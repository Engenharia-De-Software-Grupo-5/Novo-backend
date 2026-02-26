import { PrismaService } from 'src/common/database/prisma.service';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';
type CreateExpenseInput = {
    targetType: ExpenseTargetType;
    condominiumId?: string;
    propertyId?: string;
    expenseType: string;
    value: number;
    expenseDate: Date;
    paymentMethod: ExpensePaymentMethod;
};
export declare class ExpenseRepository {
    private readonly prisma;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ExpenseResponse>>;
    constructor(prisma: PrismaService);
    private assertTargetExists;
    create(input: CreateExpenseInput): Promise<{
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
    findByIdOrThrow(id: string): Promise<{
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
    update(id: string, input: CreateExpenseInput): Promise<{
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
    softDelete(id: string): Promise<{
        message: string;
    }>;
}
export {};
