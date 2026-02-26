import { PrismaService } from "src/common/database/prisma.service";
import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
export declare class PropertyRepository {
    private prisma;
    private readonly propertySelect;
    getPaginated(condominiumId: string, data: PaginationDto): Promise<PaginatedResult<PropertyResponse>>;
    constructor(prisma: PrismaService);
    getAll(condominiumId: string): Promise<PropertyResponse[]>;
    getById(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
    getByIdentificador(condominiumId: string, identifier: string): Promise<PropertyResponse>;
    create(condominiumId: string, dto: PropertyDto): Promise<PropertyResponse>;
    update(condominiumId: string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse>;
    delete(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
}
