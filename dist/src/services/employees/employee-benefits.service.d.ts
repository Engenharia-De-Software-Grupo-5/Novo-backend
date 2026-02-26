import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeeBenefitDto } from 'src/contracts/employees/employeeBenefit.dto';
import { EmployeeBenefitResponse } from 'src/contracts/employees/employeeBenefit.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class EmployeeBenefitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(employeeId: string, dto: EmployeeBenefitDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }>;
    listPaginated(employeeId: string, pagination: PaginationDto): Promise<PaginatedResult<EmployeeBenefitResponse>>;
    list(employeeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }[]>;
    update(benefitId: string, employeeId: string, dto: EmployeeBenefitDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }>;
    remove(benefitId: string, employeeId: string): Promise<{
        message: string;
    }>;
}
