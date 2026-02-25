import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome da permissão ou perfil de acesso associado',
    example: 'ADMIN',
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
  @IsString()
  @ApiPropertyOptional({
    description: 'Mensagem de retorno ou observação sobre o usuário',
    example: 'Usuário cadastrado com sucesso',
  })
  message?: string;
}
