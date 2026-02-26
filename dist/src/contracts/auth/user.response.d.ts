import { AccessData } from './auth-data.model';
export declare class UserResponse {
    id: string;
    name: string;
    email: string;
    accesses: AccessData[];
}
