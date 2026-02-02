import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { SkipUppercase } from 'src/common/decorators';

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

  @IsOptional()
  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'Permission name',
    example: 'ADMIN',
  })
  permission?: string;

  @IsOptional()
  @IsString()
  @SkipUppercase()
  @ApiProperty({
    description: 'Tipo de ambiente logado',
    example: 'schoolUnit',
    enum: ['schoolUnit', 'supportUnit', 'managementOrgan'],
  })
  environmentType?: 'schoolUnit' | 'supportUnit' | 'managementOrgan';

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID da unidade/órgão logado',
    example: 'b4d8a9a4-7cd2-4fa0-94e3-705643e1ef9a',
  })
  environmentId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID do órgão gestor responsável pelo ambiente logado',
    example: 'b4d8a9a4-7cd2-4fa0-94e3-705643e1ef9a',
  })
  managementOrganId?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1500)
  @Max(9999)
  @ApiProperty({
    description: 'ano do sistema em uso',
    example: 2025,
  })
  year: number;

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
