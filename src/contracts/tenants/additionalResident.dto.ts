import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdditionalResidentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the additional resident',
    example: 'Lucas Pereira',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Relationship with the tenant',
    example: 'Son',
  })
  relationship?: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Birth date of the additional resident',
    example: '2015-08-20T00:00:00.000Z',
  })
  birthDate: Date;
}