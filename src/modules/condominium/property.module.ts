import { Module } from '@nestjs/common';
import { PropertyController } from "src/controllers/condominiums/property.controller";
import { PropertyRepository } from "src/repositories/condominiums/property.repository";
import { PropertyService } from "src/services/condominiums/property.service";
import { MinioClientModule } from '../tools/minio-client.module';

@Module({
  imports: [MinioClientModule],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyRepository],
})
export class PropertyModule {}