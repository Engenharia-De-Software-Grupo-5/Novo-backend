import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { PropertyRepository } from "src/repositories/condominiums/property.repository";
export declare class PropertyService {
    private readonly propertyRepository;
    constructor(propertyRepository: PropertyRepository);
    getAll(condominiumId: string): Promise<PropertyResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<PropertyResponse>>;
    getById(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
    getByIdentificador(condominiumId: string, identificador: string): Promise<PropertyResponse>;
    create(condominiumId: string, dto: PropertyDto): Promise<PropertyResponse>;
    update(condominiumId: string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse>;
    delete(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
}
