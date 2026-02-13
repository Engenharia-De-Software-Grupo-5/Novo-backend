import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Campo obrigatório para o CEP do endereço',
    example: '123123',
  })
  zip: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Campo obrigatório para a rua do endereço',
    example: 'Bemvenuto',
  })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Campo obrigatório para o bairro do endereço',
    example: 'Bemvenuto',
  })
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Campo obrigatório para a cidade do endereço',
    example: 'Bemvenuto',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Campo obrigatório para o estado do endereço',
    example: 'SP',
  })
  uf: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: 'Campo obrigatório para o número do endereço',
    example: 10,
  })
  number: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo opcional para o complemento do endereço',
    example: 'Bemvenuto',
  })
  complement: string;
}
