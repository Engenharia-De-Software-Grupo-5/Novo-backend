import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EnderecoDto } from './endereco.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ImovelDto} from './imovel.dto';

export class CondominioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'Bemvenuto',
  })
  nome: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'condominio classe A',
  })
  descricao?: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  @ApiProperty({
    description: 'Todo conteudo de endereço do condominio',
    type: () => EnderecoDto,
  })
  endereco: EnderecoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImovelDto)
  @ApiProperty({
    description: 'Lista de imóveis do condomínio',
    type: () => ImovelDto,
    isArray: true,
  })
  campoObjetoArray: ImovelDto[];
  }

