import { BadRequestException, Injectable } from '@nestjs/common';
import { PropertyResponse } from 'src/contracts/condominiums/property.response';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}
  getAll(): Promise<EmployeeResponse[]> {
    return this.employeeRepository.getAll();
  }

  getPaginated(
      data: PaginationDto,
    ): Promise<PaginatedResult<EmployeeResponse>> {
      return this.employeeRepository.getPaginated(data);
    }
  
    
  getById(employeeId: string): Promise<EmployeeResponse> {
    return this.employeeRepository.getById(employeeId);
  }

  getByCpf(cpf: string): Promise<EmployeeResponse> {
    return this.employeeRepository.getByCpf(cpf);
  }

  async create(dto: EmployeeDto): Promise<EmployeeResponse> {
    const employeeExistente = await this.employeeRepository.getByCpf(
      dto.cpf,
    );

    if (!!employeeExistente) {
      throw new BadRequestException('This CPF already exists in the database.');
    }

    return this.employeeRepository.create(dto);
  }
  
  update(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.employeeRepository.update(id, dto);
  }

  updateByCpf(cpf: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.employeeRepository.updateByCpf(cpf, dto);
  }

  delete(employeeId: string): Promise<EmployeeResponse> {
    return this.employeeRepository.delete(employeeId);
  }

  deleteByCpf(cpf: string): Promise<EmployeeResponse> {
    return this.employeeRepository.deleteByCpf(cpf);
  }
}
