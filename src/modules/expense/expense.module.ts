import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/modules/tools/minio-client.module';

import { ExpenseController } from 'src/controllers/expenses/expense.controller';
import { ExpenseInvoiceController } from 'src/controllers/expenses/expense-invoice.controller';

import { ExpenseService } from 'src/services/expenses/expense.service';
import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';

import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';

@Module({
  imports: [MinioClientModule],
  controllers: [ExpenseController, ExpenseInvoiceController],
  providers: [
    ExpenseService,
    ExpenseInvoiceService,
    ExpenseRepository,
    ExpenseInvoiceRepository,
  ],
})
export class ExpenseModule {}