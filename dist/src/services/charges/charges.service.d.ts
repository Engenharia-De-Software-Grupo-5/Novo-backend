import { ChargeStatus } from '@prisma/client';
import { UpdateChargeDto } from 'src/contracts/charges/charge-update.dto';
import { ChargeDto } from 'src/contracts/charges/charge.dto';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';
export declare class ChargesService {
    private readonly repo;
    constructor(repo: ChargesRepository);
    create(dto: ChargeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.ChargeStatus;
        propertyId: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        tenantId: string;
        amount: number;
        dueDate: Date;
        fineRate: number;
        monthlyRate: number;
    }>;
    listPaginated(data: PaginationDto): Promise<PaginatedResult<PropertyResponse>>;
    list(params?: {
        tenantId?: string;
        propertyId?: string;
        status?: ChargeStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.ChargeStatus;
        propertyId: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        tenantId: string;
        amount: number;
        dueDate: Date;
        fineRate: number;
        monthlyRate: number;
    }[]>;
    findOne(chargeId: string): Promise<{
        payments: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.ChargeStatus;
        propertyId: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        tenantId: string;
        amount: number;
        dueDate: Date;
        fineRate: number;
        monthlyRate: number;
    }>;
    update(chargeId: string, dto: UpdateChargeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.ChargeStatus;
        propertyId: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        tenantId: string;
        amount: number;
        dueDate: Date;
        fineRate: number;
        monthlyRate: number;
    }>;
    cancel(chargeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.ChargeStatus;
        propertyId: string;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        tenantId: string;
        amount: number;
        dueDate: Date;
        fineRate: number;
        monthlyRate: number;
    }>;
    remove(chargeId: string): Promise<{
        message: string;
    }>;
}
