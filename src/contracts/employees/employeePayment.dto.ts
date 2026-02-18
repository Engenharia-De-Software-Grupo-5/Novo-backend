import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsDateString, Min, isNotEmpty, IsNotEmpty } from 'class-validator';
import { PaymentType } from '@prisma/client';

export class EmployeePaymentDto {
  @ApiProperty({ description: 'Payment value', example: 2500, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiProperty({ description: 'Payment date', example: '2026-02-18' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ description: 'Payment type', enum: PaymentType, example: PaymentType.SALARY })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;
}