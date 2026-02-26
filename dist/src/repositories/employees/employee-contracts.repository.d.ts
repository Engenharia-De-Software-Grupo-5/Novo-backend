import { PrismaService } from 'src/common/database/prisma.service';
export declare class EmployeeContractsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    employeeExists(id: string): import(".prisma/client").Prisma.Prisma__EmployeesClient<{
        id: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        employeeId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }): import(".prisma/client").Prisma.Prisma__EmployeeContractsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        employeeId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listByEmployee(employeeId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        employeeId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }[]>;
    findForEmployee(employeeId: string, contractId: string): import(".prisma/client").Prisma.Prisma__EmployeeContractsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        employeeId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    softDelete(contractId: string): import(".prisma/client").Prisma.Prisma__EmployeeContractsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        employeeId: string;
        objectName: string;
        originalName: string;
        mimeType: string;
        extension: string;
        size: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
