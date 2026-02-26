import { PermissionResponse } from './permission.response';
export declare class CondominiumSimpleResponse {
    id: string;
    name: string;
}
export declare class AccessData {
    permission: PermissionResponse;
    condominium: CondominiumSimpleResponse;
}
export declare class AuthDataModel {
    id: string;
    name: string;
    password: string;
    isAdminMaster: boolean;
    email: string;
    accesses: AccessData[];
}
