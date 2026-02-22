import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from './permission.response';

export class CondominiumSimpleResponse {
  @ApiProperty({
    description: 'Permission ID (UUID)',
    example: 'ad2d0c94-27d0-4562-8a2f-4c7e674d8b9d',
  })
  id: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'admin',
  })
  name: string;
}

export class AccessData {
  @ApiProperty({
    description: 'user permission',
    type: () => PermissionResponse,
  })
  permission: PermissionResponse;

  @ApiProperty({
    description: 'user permission',
    type: () => CondominiumSimpleResponse,
  })
  condominium: CondominiumSimpleResponse;
}

export class AuthDataModel {
  @ApiProperty({
    description: 'User ID (UUID)',
    example: 'aeb123e3-f930-4a32-a3d3-bcd7355b6d90',
  })
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'User password (hashed or raw, depending on context)',
    example: '12340',
  })
  password: string;

  @ApiProperty({
    description: 'User email',
    example: 'joao@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User cpf',
    example: '11111111111',
  })
  cpf: string;

  @ApiProperty({
    description: 'user accesses',
    type: () => AccessData,
  })
  accesses: AccessData[];
}
