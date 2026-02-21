import { PaymentType } from '@prisma/client';
export declare class EmployeePaymentDto {
    value: number;
    paymentDate: string;
    type: PaymentType;
}
