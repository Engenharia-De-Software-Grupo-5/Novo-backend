import { UserStatus } from '@prisma/client';
export declare class UserDto {
    name: string;
    email: string;
    cpf?: string;
    permissionsId: string;
    status?: UserStatus;
}
