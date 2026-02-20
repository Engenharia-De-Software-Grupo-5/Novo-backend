import { Module } from '@nestjs/common';
import { InterestCalculatorController } from 'src/controllers/charges/interest-calculator.controller';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';

@Module({
  controllers: [InterestCalculatorController],
  providers: [InterestCalculatorService],
})
export class ChargeModule {}