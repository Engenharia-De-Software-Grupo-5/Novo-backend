import { Module } from '@nestjs/common';
import { CondominioController } from 'src/controllers/condominios/condominio.controller';
import { CondominioRepository } from 'src/repositories/condominios/condominio.repository';
import { CondominioService } from 'src/services/condominios/condominio.service';

@Module({
  imports: [],
  controllers: [CondominioController],
  providers: [CondominioService, CondominioRepository],
})
export class CondominioModule {}
