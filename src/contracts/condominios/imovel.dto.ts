import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SituacaoImovel, TipoUnidade } from '@prisma/client';

export class ImovelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
    identificador: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
    endereco: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número ou nome da unidade (ex: apartamento 101, sala comercial 202)',
    example: 'conteúdo de exemplo',
  })
    numeroUnidade: string;
  
  @IsNotEmpty()
  @IsEnum(TipoUnidade)
  @ApiProperty({
    enum: TipoUnidade,
    enumName: 'TipoUnidade',
    example: TipoUnidade.APARTAMENTO,
  })
    tipoUnidade: TipoUnidade;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'bloco 1',
  })
    bloco?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 3,
  })
    andar?: number;

   @Type(() => Number)
   @IsNumber()
   @IsOptional()
   @ApiPropertyOptional({
    description: 'Campo numérico (m^2)',
    example: 10,
    })

    areaTotal?: number;

  @IsNotEmpty()
  @IsEnum(SituacaoImovel)
  @ApiProperty({
    enum: SituacaoImovel,
    enumName: 'SituacaoImovel',
    example: SituacaoImovel.ATIVO,
  })
  situacaoImovel: SituacaoImovel;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Dados opcionais para observações adicionais sobre o imóvel, como por exemplo: "Apartamento com vista para o mar" ou "Unidade comercial no térreo", número de vagas de garagem, etc.',
    example: 'bloco 1',
  })
    observacoes?: string;
}