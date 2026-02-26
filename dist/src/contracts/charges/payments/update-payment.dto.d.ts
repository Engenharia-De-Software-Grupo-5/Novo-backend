import { PaymentMethod } from '@prisma/client';
export declare class UpdateChargePaymentDto {
    amountPaid?: number;
    paymentDate?: string;
    method?: PaymentMethod;
    fineRate?: number;
    monthlyInterestRate?: number;
}
