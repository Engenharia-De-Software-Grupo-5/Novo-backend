import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponse {
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
