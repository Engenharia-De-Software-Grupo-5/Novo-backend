import { PaymentMethod } from '@prisma/client';
export declare class CreateChargePaymentDto {
    amountPaid: number;
    paymentDate: string;
    method: PaymentMethod;
    fineRate?: number;
    monthlyInterestRate?: number;
}
