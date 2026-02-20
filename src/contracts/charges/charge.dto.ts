import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class ChargeDto {
  @ApiProperty({ example: 'b3ed1c31-3c53-4f4b-9d1b-86fdbe2f4f10' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: 'f39d8d2b-9dd5-4a7a-bf94-4a4d7f559c8b' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ example: 1200.5, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.PIX })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 2, description: 'Fine rate (%)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fineRate?: number;

  @ApiPropertyOptional({ example: 1, description: 'Monthly rate (%)', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRate?: number;
}

