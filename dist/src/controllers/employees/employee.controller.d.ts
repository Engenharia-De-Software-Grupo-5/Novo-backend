import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { EmployeeService } from 'src/services/employees/employee.service';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    getAll(): Promise<EmployeeResponse[]>;
    getPaginated(data: PaginationDto): Promise<PaginatedResult<EmployeeResponse>>;
    getByCpf(cpf: string): Promise<EmployeeResponse>;
    getById(employeeId: string): Promise<EmployeeResponse>;
    create(dto: EmployeeDto): Promise<EmployeeResponse>;
    update(id: string, dto: EmployeeDto): Promise<EmployeeResponse>;
    updateByCpf(cpf: string, dto: EmployeeDto): Promise<EmployeeResponse>;
    delete(employeeId: string): Promise<EmployeeResponse>;
    deleteByCpf(cpf: string): Promise<EmployeeResponse>;
}
