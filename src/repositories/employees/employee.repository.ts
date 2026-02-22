import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';

@Injectable()
export class EmployeeRepository {
  

  private readonly employeeSelect = {
    id: true,
    cpf: true,
    name: true,
    bankData: true,
    role: true,
    contractType: true,
    hireDate: true,
    baseSalary: true, 
    workload: true,      
    status: true,
  }

  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(): Promise<EmployeeResponse[]> {
    return this.prisma.employees.findMany({
      where: { deletedAt: null },
      select: this.employeeSelect,
    });
  }
  getById(employeeId: string): Promise<EmployeeResponse> {
    return this.prisma.employees.findUnique({
      where: { id: employeeId, deletedAt: null },
      select: this.employeeSelect,
    });
  }

  getByCpf(cpf: string): Promise<EmployeeResponse> {
    return this.prisma.employees.findUnique({
      where: { cpf, deletedAt: null},
      select: this.employeeSelect,
    });
  }

  async create(dto: EmployeeDto): Promise<EmployeeResponse> {
    const { bankData, ...rest } = dto;
    return this.prisma.employees.upsert({
      where: {
        cpf: dto.cpf,
      },
      update: {
        ...rest,
        deletedAt: null,
      },
      create: {
        ...rest,
        bankData: {
          create: {} 
        }
      },
      select: this.employeeSelect,
    });
  }

  update(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: id },
      data: { ...dto, deletedAt: null},
      select: this.employeeSelect,
    });
  }

  updateByCpf(cpf: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { cpf },
      data: { ...dto, deletedAt: null},
      select: this.employeeSelect,
    });
  }

  delete(employeeId: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: employeeId, deletedAt: null },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }

  deleteByCpf(cpf: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { cpf, deletedAt: null },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }
}
