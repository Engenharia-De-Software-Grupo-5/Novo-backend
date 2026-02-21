import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from 'src/contracts/auth';
import { AuthRepository } from 'src/repositories/auth/auth.repository';
import { AuthDataModel } from 'src/contracts/auth/auth-data.model';
export declare class AuthService {
    private authRepository;
    private readonly jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    login(user: AuthDataModel): LoginResponse;
    validateUser(userLogin: string, recievedPassword: string): Promise<AuthDataModel>;
    passwordResetEmail(email: string): Promise<string>;
}
