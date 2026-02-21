import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
export declare class ExpenseDto {
    targetType: ExpenseTargetType;
    condominiumId?: string;
    propertyId?: string;
    expenseType: string;
    value: number;
    expenseDate: string;
    paymentMethod: ExpensePaymentMethod;
}
