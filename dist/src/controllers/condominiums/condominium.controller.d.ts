import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
export declare class CondominiumController {
    private readonly condominiumService;
    constructor(condominiumService: CondominiumService);
    getAll(): Promise<CondominiumResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<CondominiumResponse>>;
    getById(condominioId: string): Promise<CondominiumResponse>;
    create(dto: CondominiumDto): Promise<CondominiumResponse>;
    update(id: string, dto: CondominiumDto): Promise<CondominiumResponse>;
    delete(condominiumId: string): Promise<CondominiumResponse>;
}
