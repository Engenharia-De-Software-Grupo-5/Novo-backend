import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
export declare class CondominiumService {
    private readonly condominiumRepository;
    constructor(condominiumRepository: CondominiumRepository);
    getAll(): Promise<CondominiumResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<CondominiumResponse>>;
    getById(condominiumId: string): Promise<CondominiumResponse>;
    create(dto: CondominiumDto): Promise<CondominiumResponse>;
    update(id: string, dto: CondominiumDto): Promise<CondominiumResponse>;
    delete(condominiumId: string): Promise<CondominiumResponse>;
}
