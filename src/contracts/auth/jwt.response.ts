import { ApiProperty, ApiSchema } from '@nestjs/swagger';

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
    description: 'User cpf',
    example: '11111111111',
  })
  cpf: string;

  @ApiProperty({
    description: 'User name',
    example: 'john123',
  })
  name: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'ADMIN',
  })
  permission?: string;
}
