import { PermissionResponse } from './permission.response';
import { CondominiumSimpleResponse } from './auth-data.model';
export declare class AuthJwtResponse {
    id: string;
    email: string;
    name: string;
    isAdminMaster: boolean;
    permission: PermissionResponse[];
    condominium: CondominiumSimpleResponse[];
}
