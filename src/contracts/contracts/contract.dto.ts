import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
    example: '123',
  })
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for contractTemplate',
    example: '123',
  })
  contractTemplateId: string; // Removi a interrogação (?) já que tem @IsNotEmpty()

  // Adicione isto para evitar o erro "property file should not exist"
  // O class-validator vai ignorar esse campo se o Swagger enviar ele vazio.
  @IsOptional()
  file?: any;
}
