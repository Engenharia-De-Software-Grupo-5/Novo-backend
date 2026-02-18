import { Module } from '@nestjs/common';
import { PropertyController } from "src/controllers/condominiums/property.controller";
import { PropertyRepository } from "src/repositories/condominiums/property.repository";
import { PropertyService } from "src/services/condominiums/property.service";

@Module({
  imports: [],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyRepository],
})
export class PropertyModule {}