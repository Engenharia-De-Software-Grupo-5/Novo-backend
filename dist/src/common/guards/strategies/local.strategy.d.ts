import { AuthService } from 'src/services/auth/auth.service';
declare const LocalStrategy_base: new (...args: any) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(userLogin: string, password: string): Promise<import("../../../contracts/auth/auth-data.model").AuthDataModel>;
}
export {};
