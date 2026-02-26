import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeePaymentDto } from 'src/contracts/employees/employeePayment.dto';
import { EmployeePaymentResponse } from 'src/contracts/employees/employeePayment.response';
export declare class EmployeePaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(employeeId: string, dto: EmployeePaymentDto): Promise<EmployeePaymentResponse>;
    list(employeeId: string): Promise<EmployeePaymentResponse[]>;
    delete(employeeId: string, employeePaymentId: string): Promise<void>;
}
