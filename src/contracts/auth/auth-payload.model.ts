import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SkipUppercase } from 'src/common/decorators';
import { PermissionResponse } from './permission.response';
import { CondominiumSimpleResponse } from './auth-data.model';

export class AuthPayload {
  @IsUUID()
  @ApiProperty({
    description: 'User id',
    example: 'c376f0d2-8eaa-4f88-9f2f-52f8dff8794a',
  })
  sub: string;

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'User cpf',
    example: '11111111111',
  })
  cpf: string;

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'User name',
    example: 'john123',
  })
  name: string;

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'Permissions',
    type: [PermissionResponse],
  })
  permission: PermissionResponse[];

  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'Condominiums',
    type: [CondominiumSimpleResponse],
  })
  condominium: CondominiumSimpleResponse[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'JWT issued at (timestamp)',
    example: 1700000000,
  })
  iat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'JWT expiration (timestamp)',
    example: 1700003600,
  })
  exp?: number;
}
