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
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
    identifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
    adress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número ou nome da unidade (ex: apartamento 101, sala comercial 202)',
    example: 'conteúdo de exemplo',
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
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'bloco 1',
  })
    block?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
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

  @IsNotEmpty()
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