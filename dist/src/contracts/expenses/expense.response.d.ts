import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
export declare class ExpenseResponse {
    targetType: ExpenseTargetType;
    condominiumId?: string;
    propertyId?: string;
    expenseType: string;
    value: number;
    expenseDate: Date;
    paymentMethod: ExpensePaymentMethod;
}
