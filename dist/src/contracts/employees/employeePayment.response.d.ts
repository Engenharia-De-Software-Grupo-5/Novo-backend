import { PaymentType } from '@prisma/client';
export declare class EmployeePaymentResponse {
    id: string;
    value: number;
    paymentDate: string;
    type: PaymentType;
}
