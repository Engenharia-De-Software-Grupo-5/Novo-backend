import { Module } from '@nestjs/common';
import { EmployeeBenefitsController } from 'src/controllers/employees/employee-benefits.controller';
import { EmployeeBenefitsRepository } from 'src/repositories/employees/employee-benefits.repository';
import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';



@Module({
  controllers: [EmployeeBenefitsController],
  providers: [EmployeeBenefitsService, EmployeeBenefitsRepository],
})
export class EmployeeBenefitsModule {}