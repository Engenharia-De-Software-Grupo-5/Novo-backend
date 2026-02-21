import { Module } from '@nestjs/common';
import { MinioClientModule } from '../tools/minio-client.module';
import { ContractsController } from 'src/controllers/contracts/contract.controller';
import { ContractsService } from 'src/services/contracts/contract.service';
import { ContractsRepository } from 'src/repositories/contracts/contract.repository';


@Module({
  imports: [MinioClientModule],
  controllers: [ContractsController],
  providers: [ContractsService, ContractsRepository],
})
export class ContractModule {}