import { PrismaClient } from '@prisma/client';
export declare function seedEmployees(prisma: PrismaClient): Promise<{
    employee1: {
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
    };
    employee2: {
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
    };
}>;
