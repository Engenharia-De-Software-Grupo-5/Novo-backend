import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';
import { SkipUppercase } from 'src/common/decorators';

export class UserPatchDto {
  @IsString()
  @IsOptional()
  @SkipUppercase()
  @ApiPropertyOptional({
    description: 'Nome da permissão ou perfil de acesso associado',
    example: 'Admin',
  })
  role?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({
    description: 'Status atual da conta do usuário',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status?: UserStatus;
}
