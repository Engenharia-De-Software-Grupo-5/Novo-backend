import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  isString,
} from 'class-validator';
import { ExpensePaymentMethod, ExpenseTargetType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ExpenseDto {
  @ApiProperty({
    description: 'Expense target type',
    enum: ExpenseTargetType,
    example: ExpenseTargetType.CONDOMINIUM,
  })
  @IsEnum(ExpenseTargetType)
  targetType: ExpenseTargetType;

  @ApiProperty({ description: 'Expense major description', example: 'WATER' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Property id when targetType=PROPERTY',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsString()
  propertyId?: string;

  @ApiProperty({ description: 'Expense type', example: 'WATER' })
  @IsString()
  expenseType: string;

  @ApiProperty({ description: 'Expense value', example: 199.9, minimum: 0.01 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiProperty({ description: 'Expense date', example: '2026-02-18' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty()
  filesToKeep: string[];

  @ApiProperty({
    description: 'Payment method',
    enum: ExpensePaymentMethod,
    example: ExpensePaymentMethod.PIX,
  })
  @IsEnum(ExpensePaymentMethod)
  paymentMethod: ExpensePaymentMethod;
}
