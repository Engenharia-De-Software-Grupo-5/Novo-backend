import { Module } from '@nestjs/common';
import { ContratoController } from 'src/controllers/contracts/contract.controller';
import { ContratoService } from 'src/services/contracts/contrato.service';
import { ContratoRepository } from 'src/repositories/contracts/contract.repository';
@Module({
  imports: [],
  controllers: [ContratoController],
  providers: [ContratoService, ContratoRepository],
})
export class ContractModule {}
