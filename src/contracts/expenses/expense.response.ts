import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsDateString, Min } from 'class-validator';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';

export class ExpenseDto {
  @ApiProperty({ description: 'Expense target type', enum: ExpenseTargetType, example: ExpenseTargetType.CONDOMINIUM })
  @IsEnum(ExpenseTargetType)
  targetType: ExpenseTargetType;

  @ApiProperty({ description: 'Condominium id when targetType=CONDOMINIUM', required: false })
  condominiumId?: string;

  @ApiProperty({ description: 'Property id when targetType=PROPERTY', required: false })
  propertyId?: string;

  @ApiProperty({ description: 'Expense type', example: 'WATER' })
  @IsString()
  expenseType: string;

  @ApiProperty({ description: 'Expense value', example: 199.9, minimum: 0.01 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Expense date', example: '2026-02-18' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ enum: ExpensePaymentMethod, example: ExpensePaymentMethod.PIX })
  @IsEnum(ExpensePaymentMethod)
  paymentMethod: ExpensePaymentMethod;
}