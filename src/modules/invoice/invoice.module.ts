import { Module } from '@nestjs/common';
import { InvoiceController } from 'src/controllers/invoices/invoice.controller';

import { MinioClientModule } from 'src/modules/tools/minio-client.module';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';
import { InvoiceService } from 'src/services/invoices/invoice.service';

@Module({
  imports: [MinioClientModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}