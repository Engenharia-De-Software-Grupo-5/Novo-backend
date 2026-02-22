import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Example2Dto } from './example2.dto';

export class ExampleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'conteúdo de exemplo',
  })
  campo1: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo não obrigatório',
    example: 'conteúdo de exemplo',
  })
  campo2?: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Campo numérico',
    example: 10,
  })
  campoNumerico: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Campo data',
    example: '2025-02-03T00:00:00.000Z',
  })
  campoData: Date;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({
    description: 'Campo boolean',
    example: true,
  })
  campoBoolean: boolean;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Lista de strings simples',
    example: ['item1', 'item2', 'item3'],
    isArray: true,
  })
  simpleList: string[];

  @ValidateNested()
  @Type(() => Example2Dto)
  @ApiProperty({
    description: 'Campo que é outro objeto (validação aninhada)',
    type: () => Example2Dto,
  })
  campoObjeto: Example2Dto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Example2Dto)
  @ApiProperty({
    description: 'Lista de outro objeto (validação aninhada em array)',
    type: () => Example2Dto,
    isArray: true,
  })
  campoObjetoArray: Example2Dto[];
}
