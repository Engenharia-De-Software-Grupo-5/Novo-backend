import { Module } from '@nestjs/common';
import { EmployeeContractsController } from 'src/controllers/employees/employee-contracts.controller';
import { MinioClientModule } from 'src/modules/tools/minio-client.module';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';



@Module({
  imports: [MinioClientModule],
  controllers: [EmployeeContractsController],
  providers: [EmployeeContractsService, EmployeeContractsRepository],
})
export class EmployeeContractsModule {}