import { UserStatus } from '@prisma/client';
export declare class UserDto {
    name: string;
    email: string;
    role: string;
    status?: UserStatus;
    message?: string;
}
