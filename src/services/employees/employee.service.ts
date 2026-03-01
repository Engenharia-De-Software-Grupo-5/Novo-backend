import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeContractDto } from 'src/contracts/employees/employeeContract.dto';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { EmployeeContractsService } from './employee-contracts.service';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository, private readonly employeeContractsService: EmployeeContractsService) {}
  

  async getPaginated(condId: string, data: PaginationDto) {
    const result = await this.employeeRepository.getPaginated(condId, data);

    return {
      data: EmployeeResponse,
      meta: {
        total: result.meta.totalItems,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }
    
  async getById(condId: string, employeeId: string): Promise<EmployeeResponse> {
    const employee = await this.employeeRepository.getById(condId, employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async create(condId: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    const employeeExistente = await this.employeeRepository.getByCpf(
      condId,
      dto.cpf,
    );

    if (employeeExistente) {
      throw new BadRequestException('This CPF already exists in the database.');
    }

    const employee = await this.employeeRepository.create(condId, dto);
    return employee;
  }
  
  async update(condId: string, employeeId: string, dto: EmployeeDto, files?: Express.Multer.File[], existingFileIds?: string[]): Promise<EmployeeResponse> {
    const employee = await this.employeeRepository.update(condId, employeeId, dto);

    const finalContracts = await this.employeeContractsService.updateEmployeeContracts(
      condId,
      employeeId,
      files,
      existingFileIds,
    );

    const finalContractsMapped: EmployeeContractDto[] = finalContracts.map(c => ({
      id: c.id,
      name: c.originalName,
      type: c.mimeType,
      size: c.size,
      url: `/condominios/contracts/${c.id}`,
    }));


    return {
      ...employee,
      contracts: finalContractsMapped,
      lastContract: finalContractsMapped.at(-1),
    };
  }

  async delete(condId: string, employeeId: string): Promise<EmployeeResponse> {
    const employee = await this.employeeRepository.delete(condId, employeeId);
    return employee;
  }
}
