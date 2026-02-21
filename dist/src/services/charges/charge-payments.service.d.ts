import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import { CreateChargePaymentDto } from 'src/contracts/charges/payments/create-payment.dto';
import { UpdateChargePaymentDto } from 'src/contracts/charges/payments/update-payment.dto';
export declare class ChargePaymentsService {
    private readonly repo;
    private readonly minio;
    private readonly calculator;
    constructor(repo: ChargePaymentsRepository, minio: MinioClientService, calculator: InterestCalculatorService);
    private allowedProofExt;
    private ensureFile;
    private compute;
    create(chargeId: string, dto: CreateChargePaymentDto, file?: Express.Multer.File): Promise<{
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
    getProofDownloadUrl(chargeId: string, paymentId: string): Promise<{
        url: string;
    }>;
    update(chargeId: string, paymentId: string, dto: UpdateChargePaymentDto, file?: Express.Multer.File): Promise<{
        id: string;
    }>;
    remove(chargeId: string, paymentId: string): Promise<{
        message: string;
    }>;
}
