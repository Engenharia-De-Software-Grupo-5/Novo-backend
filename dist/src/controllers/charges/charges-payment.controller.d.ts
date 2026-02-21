import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { CreateChargePaymentDto } from 'src/contracts/charges/payments/create-payment.dto';
import { UpdateChargePaymentDto } from 'src/contracts/charges/payments/update-payment.dto';
export declare class ChargePaymentsController {
    private readonly service;
    constructor(service: ChargePaymentsService);
    createPayment(chargeId: string, dto: CreateChargePaymentDto, file?: Express.Multer.File): Promise<{
        id: string;
    }>;
    list(chargeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        method: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        fineRate: number;
        monthlyRate: number;
        chargeId: string;
        amountPaid: number;
        wasLate: boolean;
        daysLate: number;
        finePaid: number;
        interestPaid: number;
        totalPaid: number;
        proofObjectName: string | null;
        proofOriginalName: string | null;
        proofMimeType: string | null;
        proofExtension: string | null;
        proofSize: number | null;
    }[]>;
    findOne(chargeId: string, paymentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        method: import(".prisma/client").$Enums.PaymentMethod;
        paymentDate: Date;
        fineRate: number;
        monthlyRate: number;
        chargeId: string;
        amountPaid: number;
        wasLate: boolean;
        daysLate: number;
        finePaid: number;
        interestPaid: number;
        totalPaid: number;
        proofObjectName: string | null;
        proofOriginalName: string | null;
        proofMimeType: string | null;
        proofExtension: string | null;
        proofSize: number | null;
    }>;
    downloadProof(chargeId: string, paymentId: string): Promise<{
        url: string;
    }>;
    update(chargeId: string, paymentId: string, dto: UpdateChargePaymentDto, file?: Express.Multer.File): Promise<{
        id: string;
    }>;
    remove(chargeId: string, paymentId: string): Promise<{
        message: string;
    }>;
}
