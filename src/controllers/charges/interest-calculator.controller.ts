import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  InterestCalculatorDto,
  
} from 'src/contracts/charges/calculator/interest-calculator.dto';
import { InterestCalculatorResponse } from 'src/contracts/charges/calculator/interest-calculator.response';

import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';

@ApiTags('Charges')
@ApiBearerAuth('access-token')
@Controller('charges')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterestCalculatorController {
  constructor(private readonly service: InterestCalculatorService) {}

  @Post('interest-calculator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate fine and interest (juros e mora)',
    description:
      'Calculates 2% fine (default) and 1% monthly interest (default, prorated by days/30) for overdue payments.',
  })
  calculate(@Body() dto: InterestCalculatorDto): InterestCalculatorResponse {
    return this.service.calculate(dto);
  }
}