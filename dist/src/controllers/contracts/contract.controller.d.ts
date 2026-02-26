import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { PreviewContractDto } from 'src/contracts/contracts/preview.contract.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { ContractService } from 'src/services/contracts/contract.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';
export declare class ContractController {
    private readonly contractService;
    private readonly previewContractService;
    constructor(contractService: ContractService, previewContractService: PreviewContractService);
    getAll(): Promise<ContractResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<ContractResponse>>;
    getById(ContratoId: string): Promise<ContractResponse>;
    createWithFile(dto: ContractDto, file?: Express.Multer.File): Promise<ContractResponse>;
    update(id: string, dto: ContractDto): Promise<ContractResponse>;
    delete(ContractId: string): Promise<ContractResponse>;
    preview(dto: PreviewContractDto): Promise<{
        previewHtml: any;
    }>;
}
