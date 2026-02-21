import { PrismaService } from 'src/common/database/prisma.service';
import { CondominiumDto } from 'src/contracts/condominiums/condominium.dto';
import { CondominiumResponse } from 'src/contracts/condominiums/condominium.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
export declare class CondominiumRepository {
    private prisma;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<CondominiumResponse>>;
    private readonly condominiumSelect;
    constructor(prisma: PrismaService);
    getAll(): Promise<CondominiumResponse[]>;
    getById(condominiumId: string): Promise<CondominiumResponse>;
    getByName(name: string): Promise<CondominiumResponse>;
    create(dto: CondominiumDto): Promise<CondominiumResponse>;
    update(id: string, dto: CondominiumDto): Promise<CondominiumResponse>;
    delete(condominiumId: string): Promise<CondominiumResponse>;
}
