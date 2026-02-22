import { Module } from '@nestjs/common';
import { PropertyDocumentsController } from 'src/controllers/condominiums/property-documents.controller';
import { PropertyInspectionsController } from 'src/controllers/condominiums/property-inspections.controller';
import { PropertyController } from "src/controllers/condominiums/property.controller";
import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';
import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';
import { PropertyRepository } from "src/repositories/condominiums/property.repository";
import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';
import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';
import { PropertyService } from "src/services/condominiums/property.service";
import { MinioClientModule } from '../tools/minio-client.module';

@Module({
  imports: [MinioClientModule],
  controllers: [PropertyController, PropertyDocumentsController, PropertyInspectionsController],
  providers: [PropertyService, PropertyRepository, PropertyDocumentsRepository, PropertyInspectionsRepository, PropertyInspectionsService, PropertyDocumentsService],
})
export class PropertyModule {}