import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PermissionResponse } from './permission.response';
import { CondominiumSimpleResponse } from './auth-data.model';

@ApiSchema()
export class AuthJwtResponse {
  @ApiProperty({
    description: 'User id',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'john123',
  })
  name: string;

  @ApiProperty({
    description: 'Define se o usuário é um administrador master',
    example: false,
  })
  isAdminMaster: boolean;

  @ApiProperty({
    description: 'Permission name',
    type: [PermissionResponse],
  })
  permission: PermissionResponse[];

  @ApiProperty({
    description: 'Permission name',
    type: [CondominiumSimpleResponse],
  })
  condominium: CondominiumSimpleResponse[];
}
