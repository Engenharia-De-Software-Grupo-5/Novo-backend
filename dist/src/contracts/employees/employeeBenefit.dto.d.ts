import { BenefitType } from '@prisma/client';
export declare class EmployeeBenefitDto {
    type: BenefitType;
    referenceYear: number;
    value: number;
}
