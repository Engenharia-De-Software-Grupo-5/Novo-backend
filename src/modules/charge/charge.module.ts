import { Module } from '@nestjs/common';
;
import { ChargePaymentsService } from 'src/services/charges/charge-payments.service';
import { ChargePaymentsRepository } from 'src/repositories/charges/charge-payments.repository';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
import { ChargePaymentsController } from 'src/controllers/charges/charges-payment.controller';
import { InterestCalculatorController } from 'src/controllers/charges/interest-calculator.controller';
import { MinioClientModule } from '../tools/minio-client.module';
import { ChargesController } from 'src/controllers/charges/charge.controller';
import { ChargesService } from 'src/services/charges/charges.service';
import { ChargesRepository } from 'src/repositories/charges/charge.repository';


@Module({
  controllers: [ChargePaymentsController, InterestCalculatorController, ChargesController],
  providers: [
    ChargePaymentsService,
    ChargePaymentsRepository,
    InterestCalculatorService,
    ChargesService,
    ChargesRepository,
  ],
  imports: [MinioClientModule],
  exports: [ChargePaymentsService],
})
export class ChargesModule {}