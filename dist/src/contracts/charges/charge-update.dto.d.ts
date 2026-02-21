import { PaymentMethod } from "@prisma/client";
export declare class UpdateChargeDto {
    amount?: number;
    dueDate?: string;
    paymentMethod?: PaymentMethod;
    fineRate?: number;
    monthlyRate?: number;
}
