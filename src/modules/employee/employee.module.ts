import { Module } from '@nestjs/common';
import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { EmployeeService } from 'src/services/employees/employee.service';

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
