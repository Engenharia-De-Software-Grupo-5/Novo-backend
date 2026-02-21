import { PrismaService } from 'src/common/database/prisma.service';
export declare class ChargePaymentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertCharge(chargeId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ChargeStatus;
        amount: number;
        dueDate: Date;
    }>;
    assertPayment(chargeId: string, paymentId: string): Promise<{
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
    private isOverdue;
    syncChargeStatus(chargeId: string): Promise<void>;
    createPayment(chargeId: string, data: {
        amountPaid: number;
        paymentDate: Date;
        method: any;
        calc: {
            wasLate: boolean;
            daysLate: number;
            fineRate: number;
            monthlyRate: number;
            finePaid: number;
            interestPaid: number;
            totalPaid: number;
        };
        proof?: {
            objectName: string;
            originalName: string;
            mimeType: string;
            extension: string;
            size: number;
        };
    }): Promise<{
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
    updatePayment(chargeId: string, paymentId: string, data: {
        amountPaid: number;
        paymentDate: Date;
        method: any;
        calc: {
            wasLate: boolean;
            daysLate: number;
            fineRate: number;
            monthlyRate: number;
            finePaid: number;
            interestPaid: number;
            totalPaid: number;
        };
        proof?: {
            objectName: string;
            originalName: string;
            mimeType: string;
            extension: string;
            size: number;
        } | null;
    }): Promise<{
        updated: {
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
        };
        previousProofObject: string;
    }>;
    listPayments(chargeId: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    getPayment(chargeId: string, paymentId: string): import(".prisma/client").Prisma.Prisma__PaymentsClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    softDeletePayment(chargeId: string, paymentId: string): Promise<{
        message: string;
    }>;
}
