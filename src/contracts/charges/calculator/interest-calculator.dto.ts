import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class InterestCalculatorDto {
  @ApiProperty({
    description: 'Original amount (principal) to be paid.',
    example: 1000,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  principal: number;

  @ApiProperty({
    description: 'Due date (YYYY-MM-DD).',
    example: '2026-02-10',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Reference payment date (YYYY-MM-DD).',
    example: '2026-02-18',
  })
  @IsDateString()
  referenceDate: string;

  @ApiPropertyOptional({
    description: 'Fine rate (as a fraction). Default: 0.02 (2%).',
    example: 0.02,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  fineRate?: number;

  @ApiPropertyOptional({
    description:
      'Monthly interest rate (as a fraction). Default: 0.01 (1% per month), prorated by days late (monthly/30).',
    example: 0.01,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  monthlyInterestRate?: number;
}

