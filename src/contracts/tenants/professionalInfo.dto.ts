import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProfessionalInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company name where the tenant works',
    example: 'Tech Solutions LTDA',
  })
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company phone number',
    example: '+55 83 3333-2222',
  })
  companyPhone: string;

  @IsUUID()
  @ApiProperty({
    description: 'UUID of the company address',
    example: '6fe3e12a-8fb2-454e-9166-b12396cde907',
  })
  companyAddressId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Position held by the tenant',
    example: 'Software Engineer',
  })
  position: string;

  @IsNumber()
  @ApiProperty({
    description: 'Number of months working at the company',
    example: 24,
  })
  monthsWorking: number;
}