import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Example2Dto } from '../examples/example2.dto';
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
    description: 'Descrição de exemplo para campo obrigatório',
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: '3 andar',
  })
    andar?: number;

   @Type(() => Number)
   @IsNumber()
   @IsOptional()
   @ApiPropertyOptional({
    description: 'Campo numérico',
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
  situacao: SituacaoImovel;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'bloco 1',
  })
    observacoes?: string;
}