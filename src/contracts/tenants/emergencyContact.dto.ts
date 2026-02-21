import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the emergency contact',
    example: 'Maria Silva',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Relationship with the tenant',
    example: 'Mother',
  })
  relationship?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone number of the emergency contact',
    example: '+55 83 99999-9999',
  })
  phone: string;
}