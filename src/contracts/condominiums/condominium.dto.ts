import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Example2Dto } from '../examples/example2.dto';
import { Type } from 'class-transformer';

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
    example: 'A class condominium',
  })
  description?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({
    description: 'Todo conteudo de endereço do condominio',
    type: () => AddressDto,
  })
  address: AddressDto;
}
