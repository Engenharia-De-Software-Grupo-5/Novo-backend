import { BenefitType } from '@prisma/client';
export declare class EmployeeBenefitResponse {
    id: string;
    type: BenefitType;
    referenceYear: number;
    value: number;
}
