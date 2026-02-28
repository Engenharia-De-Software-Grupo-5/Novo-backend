import { Module } from '@nestjs/common';
import { CondominiumController } from 'src/controllers/condominiums/condominium.controller';
import { CondominiumRepository } from 'src/repositories/condominiums/condominium.repository';
import { CondominiumService } from 'src/services/condominiums/condominium.service';
import { UserModule } from '../auth/user.module';

@Module({
  imports: [UserModule],
  controllers: [CondominiumController],
  providers: [CondominiumService, CondominiumRepository],
})
export class CondominiumModule {}
