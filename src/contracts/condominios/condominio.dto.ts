import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EnderecoDto } from './endereco.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Example2Dto } from '../examples/example2.dto';
import { Type } from 'class-transformer';

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
}
