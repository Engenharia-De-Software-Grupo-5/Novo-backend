import { PrismaService } from 'src/common/database/prisma.service';
import { BenefitType } from '@prisma/client';
export declare class EmployeeBenefitsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findEmployeeById(employeeId: string): import(".prisma/client").Prisma.Prisma__EmployeesClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.EmployeeStatus;
        cpf: string;
        role: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        hireDate: Date;
        terminationDate: Date | null;
        baseSalary: number;
        workload: number;
        bankDataId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        employeeId: string;
        type: BenefitType;
        referenceYear: number;
        value: number;
    }): import(".prisma/client").Prisma.Prisma__EmployeeBenefitsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByEmployee(employeeId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__EmployeeBenefitsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__EmployeeBenefitsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    softDelete(id: string): import(".prisma/client").Prisma.Prisma__EmployeeBenefitsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.BenefitType;
        value: number;
        referenceYear: number;
        employeeId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
