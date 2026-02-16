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
  ownerId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Describe an aditional info about the contract',
    example: 'Clausulas do contrato',
  })
  descricao?: string;

  @ValidateNested()
  @ApiProperty({
    description: 'a property ',
  })
  propertieId: string;
}
