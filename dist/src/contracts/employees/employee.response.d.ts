import { ContractType, EmployeeStatus } from "@prisma/client";
import { BankDataResponse } from "./bankData.response";
export declare class EmployeeResponse {
    id: string;
    cpf: string;
    name: string;
    bankData: BankDataResponse;
    role: string;
    contractType: ContractType;
    hireDate: Date;
    baseSalary: number;
    workload: number;
    status?: EmployeeStatus;
}
