import { ApiProperty } from '@nestjs/swagger';
import { AccessData } from './auth-data.model';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  @ApiProperty({
    description: 'user accesses',
    type: () => AccessData,
  })
  accesses: AccessData[];
}
