import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";
import { IsOptional, IsNumber, Min, IsDateString, IsEnum } from "class-validator";

export class UpdateChargeDto {
  @ApiPropertyOptional({ example: 1300, minimum: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ example: '2026-03-15' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.BOLETO })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ example: 2, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fineRate?: number;

  @ApiPropertyOptional({ example: 1, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRate?: number;
}