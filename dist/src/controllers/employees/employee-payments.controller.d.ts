import { EmployeePaymentDto } from 'src/contracts/employees/employeePayment.dto';
import { EmployeePaymentResponse } from 'src/contracts/employees/employeePayment.response';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';
export declare class EmployeePaymentsController {
    private readonly service;
    constructor(service: EmployeePaymentsService);
    create(employeeId: string, dto: EmployeePaymentDto): Promise<EmployeePaymentResponse>;
    list(employeeId: string): Promise<EmployeePaymentResponse[]>;
    delete(employeeId: string, paymentId: string): Promise<void>;
}
