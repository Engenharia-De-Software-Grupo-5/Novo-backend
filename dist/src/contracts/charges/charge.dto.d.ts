import { PaymentMethod } from '@prisma/client';
export declare class ChargeDto {
    tenantId: string;
    propertyId: string;
    amount: number;
    dueDate: string;
    paymentMethod: PaymentMethod;
    fineRate?: number;
    monthlyRate?: number;
}
