import { ApiProperty } from '@nestjs/swagger';
import { AuthDataModel } from './auth-data.model';

export class AuthRequestModel extends Request {
  @ApiProperty({
    description: 'An user like in database',
    example:
      '{\n"email": "user@example.com",\n"name": "John",\n"password": undefined}',
  })
  user: AuthDataModel;
}
