import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the zip code of the address',
    example: '123123',
  })
  zip: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the street of the address',
    example: 'Bemvenuto',
  })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the neighborhood of the address',
    example: 'Bemvenuto',
  })
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the city of the address',
    example: 'Bemvenuto',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Obrigatory field for the state of the address',
    example: 'SP',
  })
  uf: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Obrigatory field for the number of the address',
    example: 10,
  })
  number: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Opcional field for the complement of the address',
    example: 'Bemvenuto',
  })
  complement: string;
}
