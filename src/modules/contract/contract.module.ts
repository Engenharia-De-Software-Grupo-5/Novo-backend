import { Module } from '@nestjs/common';

import { ContractService } from 'src/services/contracts/contract.service';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { ContractController } from 'src/controllers/contracts/contract.controller';
@Module({
  imports: [],
  controllers: [ContractController],
  providers: [ContractService, ContractRepository],
})
export class ContractModule {}
