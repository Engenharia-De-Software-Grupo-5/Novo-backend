import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
export declare class EmployeeContractsController {
    private readonly service;
    constructor(service: EmployeeContractsService);
    upload(employeeId: string, file?: Express.Multer.File): Promise<{
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
    }>;
    list(employeeId: string): Promise<{
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
    findOne(employeeId: string, contractId: string): Promise<{
        url: string;
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
    }>;
    download(employeeId: string, contractId: string): Promise<{
        url: string;
    }>;
    remove(employeeId: string, contractId: string): Promise<void>;
}
