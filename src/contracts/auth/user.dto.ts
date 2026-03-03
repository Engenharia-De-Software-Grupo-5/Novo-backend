import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserStatus } from '@prisma/client';
import { SkipUppercase } from 'src/common/decorators';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @SkipUppercase()
  @ApiProperty({
    description: 'Nome da permissão ou perfil de acesso associado',
    example: 'Admin',
  })
  role: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({
    description: 'Status atual da conta do usuário',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status?: UserStatus;

  @IsOptional()
  @SkipUppercase()
  @IsString()
  @ApiPropertyOptional({
    description: 'Mensagem de retorno ou observação sobre o usuário',
    example: 'Usuário cadastrado com sucesso',
  })
  message?: string;
}
