import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

const emptyToUndefined = () =>
  Transform(({ value }: { value: unknown }) => (value === '' || value === null ? undefined : value));

export class UpdateChargePaymentDto {
  @ApiPropertyOptional({ example: 1000, minimum: 0.01 })
  @IsOptional()
  @emptyToUndefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amountPaid?: number;

  @ApiPropertyOptional({ example: '2026-02-18' })
  @IsOptional()
  @emptyToUndefined()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.PIX })
  @IsOptional()
  @emptyToUndefined()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional({ example: 0.02, minimum: 0, maximum: 1 })
  @IsOptional()
  @emptyToUndefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  fineRate?: number;

  @ApiPropertyOptional({ example: 0.01, minimum: 0, maximum: 1 })
  @IsOptional()
  @emptyToUndefined()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  monthlyInterestRate?: number;
}