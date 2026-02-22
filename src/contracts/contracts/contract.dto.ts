import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContractDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the owner',
    example: '123',
  })
  tenantId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Describe an aditional info about the contract',
    example: 'Clausulas do contrato',
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the property',
    example: '123'
  })
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for contractTemplate',
    example: '123'
  })
  contractTemplateId?: string;
}
