import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CondominiumDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the name of the condominium',
    example: 'Bemvenuto',
  })
  name: string;

  // @IsString()
  // @IsOptional()
  // @ApiPropertyOptional({
  //   description: 'Obrigatory field for the description of the condominium',
  //   example: 'condominio classe A',
  // })
  // description: string;

  // @ValidateNested()
  // @Type(() => AddressDto)
  // @ApiProperty({
  //   description: 'Obrigatory field for the address of the condominium',
  //   type: () => AddressDto,
  // })
  // address: AddressDto;
  }

