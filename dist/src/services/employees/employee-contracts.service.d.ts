import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
export declare class EmployeeContractsService {
    private readonly repo;
    private readonly minio;
    private readonly allowedExtensions;
    constructor(repo: EmployeeContractsRepository, minio: MinioClientService);
    upload(employeeId: string, file: Express.Multer.File): Promise<{
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
    getDownloadUrl(employeeId: string, contractId: string): Promise<{
        url: string;
    }>;
    remove(employeeId: string, contractId: string): Promise<void>;
}
