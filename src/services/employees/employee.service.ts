import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeSummaryFrontResponse, EmployeeDetailFrontResponse, EmployeeContractFront } from 'src/contracts/employees/employee.front.dto';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { EmployeeContractsService } from './employee-contracts.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository, private readonly employeeContractsService: EmployeeContractsService) {}
  private mapToSummaryFront(employee: any): EmployeeSummaryFrontResponse {
    const contracts = employee.employeeContracts ?? [];

    const mappedContracts = contracts.map(c => ({
      id: c.id,
      name: c.originalName,
      type: c.mimeType,
      size: c.size,
      url: `/condominios/contracts/${c.id}`,
    }));

    return {
      id: employee.id,
      name: employee.name,
      role: employee.role.toLowerCase(),
      status: employee.status?.toLowerCase(),
      lastContract: mappedContracts.at(-1),
    };
  }

  private mapToDetailFront(employee: any): EmployeeDetailFrontResponse {
    const contracts = employee.employeeContracts ?? [];

    const mappedContracts = contracts.map(c => ({
      id: c.id,
      name: c.originalName,
      type: c.mimeType,
      size: c.size,
      url: `/condominios/contracts/${c.id}`,
    }));

    return {
      id: employee.id,
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,

      birthDate: employee.birthDate.toISOString(),
      admissionDate: employee.admissionDate?.toISOString(),

      role: employee.role.toLowerCase(),
      status: employee.status?.toLowerCase(),

      contracts: mappedContracts,
      lastContract: mappedContracts.at(-1),
    };
  }

  async getPaginated(condId: string, data: PaginationDto) {
    const result = await this.employeeRepository.getPaginated(condId, data);

    return {
      data: result.items.map(e => this.mapToSummaryFront(e)),
      meta: {
        total: result.meta.totalItems,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }
    
  async getById(condId: string, employeeId: string): Promise<EmployeeDetailFrontResponse> {
    const employee = await this.employeeRepository.getById(condId, employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return this.mapToDetailFront(employee);
  }

  async create(condId: string, dto: EmployeeDto): Promise<EmployeeDetailFrontResponse> {
    const employeeExistente = await this.employeeRepository.getByCpf(
      condId,
      dto.cpf,
    );

    if (employeeExistente) {
      throw new BadRequestException('This CPF already exists in the database.');
    }

    const employee = await this.employeeRepository.create(condId, dto);
    return this.mapToDetailFront(employee);
  }
  
  async update(condId: string, employeeId: string, dto: EmployeeDto, files?: Express.Multer.File[], existingFileIds?: string[]): Promise<EmployeeDetailFrontResponse> {
    const employee = await this.employeeRepository.update(condId, employeeId, dto);

    const finalContracts = await this.employeeContractsService.updateEmployeeContracts(
      condId,
      employeeId,
      files,
      existingFileIds,
    );

    const finalContractsMapped: EmployeeContractFront[] = finalContracts.map(c => ({
      id: c.id,
      name: c.originalName,
      type: c.mimeType,
      size: c.size,
      url: `/condominios/contracts/${c.id}`,
    }));


    return {
      ...this.mapToDetailFront(employee),
      contracts: finalContractsMapped,
      lastContract: finalContractsMapped.at(-1),
    };
  }

  async delete(condId: string, employeeId: string): Promise<EmployeeSummaryFrontResponse> {
    const employee = await this.employeeRepository.delete(condId, employeeId);
    return this.mapToSummaryFront(employee);
  }
}
