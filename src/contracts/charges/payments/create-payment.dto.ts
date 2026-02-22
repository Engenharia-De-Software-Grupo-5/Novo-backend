import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateChargePaymentDto {
  @ApiProperty({ description: 'Paid amount', example: 1000, minimum: 0.01 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amountPaid: number;

  @ApiProperty({ description: 'Payment date (YYYY-MM-DD)', example: '2026-02-18' })
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod, example: PaymentMethod.PIX })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Fine rate fraction (default 0.02)', example: 0.02, minimum: 0, maximum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  fineRate?: number;

  @ApiPropertyOptional({ description: 'Monthly interest fraction (default 0.01)', example: 0.01, minimum: 0, maximum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  monthlyInterestRate?: number;
}