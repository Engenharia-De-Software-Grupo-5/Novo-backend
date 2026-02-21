import { UserStatus } from '@prisma/client';
import { PermissionResponse } from './permission.response';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  status: UserStatus;
  permission: PermissionResponse;
}
