import { PrismaService } from 'src/common/database/prisma.service';
import { PaymentType } from '@prisma/client';
export declare class EmployeePaymentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    employeeExists(employeeId: string): import(".prisma/client").Prisma.Prisma__EmployeesClient<{
        id: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        employeeId: string;
        value: number;
        paymentDate: Date;
        type: PaymentType;
    }): import(".prisma/client").Prisma.Prisma__EmployeePaymentsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.PaymentType;
        value: number;
        employeeId: string;
        paymentDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listByEmployee(employeeId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.PaymentType;
        value: number;
        employeeId: string;
        paymentDate: Date;
    }[]>;
    delete(employeeId: string, employeePaymentId: string): import(".prisma/client").Prisma.Prisma__EmployeePaymentsClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        type: import(".prisma/client").$Enums.PaymentType;
        value: number;
        employeeId: string;
        paymentDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
