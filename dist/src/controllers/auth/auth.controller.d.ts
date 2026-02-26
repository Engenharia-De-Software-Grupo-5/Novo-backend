import { AuthService } from 'src/services/auth/auth.service';
import { LoginResponse } from 'src/contracts/auth';
import { AuthRequestModel } from 'src/contracts/auth/auth-request.model';
import { ResetPasswordDto } from 'src/contracts/auth/reset-password.dto';
import { MailService } from 'src/services/tools/mail.service';
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    private readonly logger;
    constructor(authService: AuthService, mailService: MailService);
    login(req: AuthRequestModel): LoginResponse;
    passwordResetEmail(authResetPasswordDto: ResetPasswordDto): Promise<void>;
}
