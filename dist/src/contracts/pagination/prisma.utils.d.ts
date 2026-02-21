import { PaginationDto } from './pagination.dto';
interface FilterOptions {
    numberFields?: string[];
    dateFields?: string[];
    enumFields?: string[];
    booleanFields?: string[];
    customMappings?: Record<string, (content: string) => any>;
}
export declare function buildDynamicWhere(dto: PaginationDto, fixedWhere?: any, options?: FilterOptions): any;
export {};
