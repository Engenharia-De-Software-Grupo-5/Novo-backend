import { Module } from '@nestjs/common';
import { EmployeeBenefitsController } from 'src/controllers/employees/employee-benefits.controller';
import { EmployeePaymentsController } from 'src/controllers/employees/employee-payments.controller';
import { EmployeeController } from 'src/controllers/employees/employee.controller';
import { EmployeeBenefitsRepository } from 'src/repositories/employees/employee-benefits.repository';
import { EmployeePaymentsRepository } from 'src/repositories/employees/employee-payments.repository';
import { EmployeeRepository } from 'src/repositories/employees/employee.repository';
import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';
import { EmployeeService } from 'src/services/employees/employee.service';
import { MinioClientModule } from '../tools/minio-client.module';
import { EmployeeContractsController } from 'src/controllers/employees/employee-contracts.controller';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';

@Module({
  imports: [MinioClientModule],
  controllers: [EmployeeController, EmployeeBenefitsController, EmployeePaymentsController, EmployeeContractsController],
  providers: [EmployeeService, EmployeeRepository, EmployeeBenefitsService, EmployeeBenefitsRepository, EmployeePaymentsService, EmployeePaymentsRepository, EmployeeContractsService, EmployeeContractsRepository],
})
export class EmployeeModule {}
