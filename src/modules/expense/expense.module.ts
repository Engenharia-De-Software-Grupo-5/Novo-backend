import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/modules/tools/minio-client.module';

import { ExpenseController } from 'src/controllers/condominiums/expense.controller';

import { ExpenseService } from 'src/services/expenses/expense.service';

import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';

@Module({
  imports: [MinioClientModule],
  controllers: [ExpenseController],
  providers: [
    ExpenseService,
    ExpenseRepository,
  ],
})
export class ExpenseModule {}