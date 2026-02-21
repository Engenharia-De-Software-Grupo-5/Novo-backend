import { PropertyDto } from 'src/contracts/condominiums/property.dto';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PropertyService } from 'src/services/condominiums/property.service';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    getAll(condominiumId: string): Promise<PropertyResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<PropertyResponse>>;
    getById(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
    create(condominiumId: string, dto: PropertyDto): Promise<PropertyResponse>;
    update(condominiumId: string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse>;
    delete(condominiumId: string, propertyId: string): Promise<PropertyResponse>;
}
