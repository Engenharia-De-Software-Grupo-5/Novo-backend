import { Module } from '@nestjs/common';

import { ContractService } from 'src/services/contracts/contract.service';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';
import { ContractController } from 'src/controllers/contracts/contract.controller';
import { MinioClientModule } from '../tools/minio-client.module';
import { GenerateContractService } from 'src/services/tools/generate-contract.service';
import { TemplateEngineService } from 'src/services/tools/template-engine.service';
import { PdfGeneratorService } from 'src/services/tools/pdf-generator.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';
import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';
@Module({
  imports: [MinioClientModule],
  controllers: [ContractController],
  providers: [ContractService, ContractRepository, GenerateContractService, TemplateEngineService, PdfGeneratorService, PreviewContractService, ContractTemplateRepository],
})
export class ContractModule { }
