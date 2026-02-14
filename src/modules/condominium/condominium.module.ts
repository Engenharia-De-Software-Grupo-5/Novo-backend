import { Module } from '@nestjs/common';
import { CondominiumController } from 'src/controllers/condominiums/condominium.controller';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { CondominiumService } from 'src/services/condominiums/condominium.service';

@Module({
  imports: [],
  controllers: [CondominiumController],
  providers: [CondominiumService, CondominiumRepository],
})
export class CondominiumModule {}
