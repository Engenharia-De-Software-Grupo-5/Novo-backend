import { EmployeeStatus, ContractType } from '@prisma/client';
import { BankDataDto } from './bankData.dto';
export declare class EmployeeDto {
    cpf: string;
    name: string;
    bankData: BankDataDto;
    role: string;
    contractType: ContractType;
    hireDate: Date;
    baseSalary: number;
    workload: number;
    status?: EmployeeStatus;
}
