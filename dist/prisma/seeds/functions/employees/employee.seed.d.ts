import { PrismaClient } from '@prisma/client';
export declare function seedEmployees(prisma: PrismaClient): Promise<{
    employee1: {
        id: string;
        cpf: string;
        name: string;
        status: import(".prisma/client").$Enums.EmployeeStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        role: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        hireDate: Date;
        terminationDate: Date | null;
        baseSalary: number;
        workload: number;
        bankDataId: string;
    };
    employee2: {
        id: string;
        cpf: string;
        name: string;
        status: import(".prisma/client").$Enums.EmployeeStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        role: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        hireDate: Date;
        terminationDate: Date | null;
        baseSalary: number;
        workload: number;
        bankDataId: string;
    };
}>;
