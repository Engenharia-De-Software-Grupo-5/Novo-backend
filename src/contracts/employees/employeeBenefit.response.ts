import { ApiProperty } from '@nestjs/swagger';
import { BenefitType } from '@prisma/client';
import { IsString } from 'class-validator';

export class EmployeeBenefitResponse {
  @ApiProperty({
    description: 'Employee benefit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
})
  @IsString()
  id: string;

  @ApiProperty({ description: 'Type of benefit', enum: BenefitType })
  type: BenefitType;

  @ApiProperty({ description: 'Reference year for the benefit',
    example: 2026 })
  referenceYear: number;

  @ApiProperty({ description: 'Value of the benefit',
     example: 2500 })
  value: number;
}