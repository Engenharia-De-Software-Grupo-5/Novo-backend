import { ApiProperty } from '@nestjs/swagger';
import { BenefitType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';


export class EmployeeBenefitDto {
  @ApiProperty({ description: 'Type of benefit', enum: BenefitType, example: BenefitType.THIRTEENTH })
  @IsEnum(BenefitType)
  type: BenefitType;

  @ApiProperty({ description: 'Reference year for the benefit', example: 2026 })
  @IsNotEmpty()
  @IsInt()
  referenceYear: number;

  @ApiProperty({ description: 'Value of the benefit', example: 2500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  value: number;
}