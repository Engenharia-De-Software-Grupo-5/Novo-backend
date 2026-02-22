import { UserStatus } from '@prisma/client';

export class UserDto {
  name: string;
  email: string;
  cpf?: string;
  permissionsId: string;
  status?: UserStatus;
}
