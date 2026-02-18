import { Module } from '@nestjs/common';
import { EmployeePaymentsController } from 'src/controllers/employees/employee-payments.controller';
import { EmployeePaymentsRepository } from 'src/repositories/employees/employee-payments.repository';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';


@Module({
  controllers: [EmployeePaymentsController],
  providers: [EmployeePaymentsService, EmployeePaymentsRepository],
})
export class EmployeePaymentsModule {}