import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './adress.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PropertyDto} from './property.dto';

export class CondominiumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'Bemvenuto',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Descrição de exemplo para campo obrigatório',
    example: 'condominio classe A',
  })
  description: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({
    description: 'Todo conteudo de endereço do condominio',
    type: () => AddressDto,
  })
  address: AddressDto;
  }

