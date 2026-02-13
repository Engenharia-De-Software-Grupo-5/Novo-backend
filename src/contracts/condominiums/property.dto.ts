import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PropertySituation, UnityType } from '@prisma/client';

export class PropertyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identificador único para a unidade, como número do apartamento ou sala comercial',
    example: '101',
  })
    identifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Informações adicionais acerca do endereço',
    example: 'Próximo à casa X, Rua Y, etc.',
  })
    address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número ou nome da unidade (ex: apartamento 101, sala comercial 202)',
    example: '101',
  })
    unityNumber: string;
  
  @IsNotEmpty()
  @IsEnum(UnityType)
  @ApiProperty({
    enum: UnityType,
    enumName: 'UnityType',
    example: UnityType.APARTMENT,
  })
    unityType: UnityType;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição do bloco da unidade',
    example: 'bloco 1',
  })
    block?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo numérico para o andar da unidade, se aplicável',
    example: 3,
  })
    floor?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo numérico (m^2)',
    example: 10,
  })
  totalArea?: number;
  
  @IsEnum(PropertySituation)
  @ApiProperty({
    enum: PropertySituation,
    enumName: 'PropertySituation',
    example: PropertySituation.ACTIVE,
  })
  propertySituation: PropertySituation;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Dados opcionais para observações adicionais sobre o imóvel, como por exemplo: "Apartamento com vista para o mar" ou "Unidade comercial no térreo", número de vagas de garagem, etc.',
    example: 'bloco 1',
  })
    observations?: string;
}