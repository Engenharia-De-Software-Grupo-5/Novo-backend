import { ApiProperty } from "@nestjs/swagger";

export class InterestCalculatorResponse {
  @ApiProperty({ example: 1000 })
  principal: number;

  @ApiProperty({ example: '2026-02-10' })
  dueDate: string;

  @ApiProperty({ example: '2026-02-18' })
  referenceDate: string;

  @ApiProperty({ description: 'Days late (0 if referenceDate <= dueDate).', example: 8 })
  daysLate: number;

  @ApiProperty({ description: 'Applied fine rate (fraction).', example: 0.02 })
  fineRate: number;

  @ApiProperty({ description: 'Applied monthly interest rate (fraction).', example: 0.01 })
  monthlyInterestRate: number;

  @ApiProperty({ description: 'Fine value (rounded to 2 decimals).', example: 20 })
  fineValue: number;

  @ApiProperty({ description: 'Interest value (rounded to 2 decimals).', example: 2.67 })
  interestValue: number;

  @ApiProperty({ description: 'Total updated value (rounded to 2 decimals).', example: 1022.67 })
  totalUpdated: number;
}