import { UserStatus } from '@prisma/client';
import { PermissionResponse } from './permission.response';
export declare class UserResponse {
    id: string;
    name: string;
    email: string;
    cpf?: string;
    status: UserStatus;
    permission: PermissionResponse;
}
