import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsCPF } from 'class-validator-cpf';

import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class SpouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Spouse full name',
    example: 'João Pereira',
  })
  name: string;

  @IsCPF()
  @ApiProperty({
    description: 'Spouse CPF (numbers only)',
    example: '17508074084',
  })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Spouse rg',
    example: '123456789',
  })
  rg: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Spouse profession',
    example: 'Doctor',
  })
  profession: string;

  @IsNumber()
  @ApiProperty({
    description: 'Spouse monthly income',
    example: 8000,
  })
  monthlyIncome: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Spouse birth date',
    example: '1990-05-10T00:00:00.000Z',
  })
  birthDate: Date;
}