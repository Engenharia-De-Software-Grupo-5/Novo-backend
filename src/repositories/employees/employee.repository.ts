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
      where: { cpf },
      select: this.employeeSelect,
    });
  }

  create(dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.prisma.employees.upsert({
      where: {
        cpf: dto.cpf,
      },
      update: {
        ...dto,
        deletedAt: null,
      },
      create: {
        ...dto
      },
      select: this.employeeSelect,
    });
  }

  update(id: string, dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: id },
      data: { ...dto},
      select: this.employeeSelect,
    });
  }

  delete(employeeId: string): Promise<EmployeeResponse> {
    return this.prisma.employees.update({
      where: { id: employeeId },
      data: { deletedAt: new Date() },
      select: this.employeeSelect,
    });
  }
}
