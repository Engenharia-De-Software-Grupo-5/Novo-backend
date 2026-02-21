import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { EmployeeBenefitDto } from 'src/contracts/employees/employeeBenefit.dto';
import { EmployeeBenefitResponse } from 'src/contracts/employees/employeeBenefit.response';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
export declare class EmployeeBenefitsController {
    private readonly service;
    constructor(service: EmployeeBenefitsService);
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
    listPaginated(employeeId: string, data: PaginationDto): Promise<PaginatedResult<EmployeeBenefitResponse>>;
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
    update(id: string, employeeId: string, dto: EmployeeBenefitDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }>;
    remove(id: string, employeeId: string): Promise<void>;
}
