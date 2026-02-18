import { Module } from '@nestjs/common';
import { CondominiumInvoiceController } from 'src/controllers/invoices/condominium.invoice.controller';
import { PropertyInvoiceController } from 'src/controllers/invoices/property.invoice.controller';
import { MinioClientModule } from 'src/modules/tools/minio-client.module';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';
import { CondominiumInvoiceService } from 'src/services/invoices/condominium.invoice.service';
import { PropertyInvoiceService } from 'src/services/invoices/property.invoice.service';

@Module({
  imports: [MinioClientModule],
  controllers: [CondominiumInvoiceController, PropertyInvoiceController],
  providers: [CondominiumInvoiceService, PropertyInvoiceService, InvoiceRepository],
})
export class InvoiceModule {}