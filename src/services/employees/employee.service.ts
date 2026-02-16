import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}
  getAll(): Promise<EmployeeResponse[]> {
    return this.employeeRepository.getAll();
  }
  getById(employeeId: string): Promise<EmployeeResponse> {
    return this.employeeRepository.getById(employeeId);
  }

  async create(dto: EmployeeDto): Promise<EmployeeResponse> {
    const employeeExistente = await this.employeeRepository.getByCpf(
      dto.cpf,
    );

    if (!!employeeExistente) {
      throw new BadRequestException('Duplicated CPF');
    }

    return this.employeeRepository.create(dto);
  }
  
  update(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.employeeRepository.update(id, dto);
  }

  delete(employeeId: string): Promise<EmployeeResponse> {
    return this.employeeRepository.delete(employeeId);
  }
}
