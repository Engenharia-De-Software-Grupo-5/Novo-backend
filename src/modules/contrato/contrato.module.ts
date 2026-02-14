import { Module } from '@nestjs/common';
import { ContratoController } from 'src/controllers/contratos/contrato.controller';
import { ContratoService } from 'src/services/contratos/contrato.service';
import { ContratoRepository } from 'src/repositories/contratos/contrato.repository';
@Module({
  imports: [],
  controllers: [ContratoController],
  providers: [ContratoService, ContratoRepository],
})
export class CondominioModule {}
