"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../common/decorators");
const auth_service_1 = require("../../services/auth/auth.service");
const guards_1 = require("../../common/guards");
const auth_1 = require("../../contracts/auth");
const auth_request_model_1 = require("../../contracts/auth/auth-request.model");
const reset_password_dto_1 = require("../../contracts/auth/reset-password.dto");
const mail_service_1 = require("../../services/tools/mail.service");
let AuthController = AuthController_1 = class AuthController {
    authService;
    mailService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, mailService) {
        this.authService = authService;
        this.mailService = mailService;
    }
    login(req) {
        return this.authService.login(req.user);
    }
    async passwordResetEmail(authResetPasswordDto) {
        try {
            const password = await this.authService.passwordResetEmail(authResetPasswordDto.email);
            this.mailService.sendMail(authResetPasswordDto.email, 'Password Reset', `Your new password is: ${password}`);
        }
        catch (error) {
            this.logger.error(`Password reset failed for email: ${authResetPasswordDto.email}`, error);
            throw new common_1.HttpException('User not found.', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorators_1.IsPublic)(),
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(guards_1.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login',
        description: 'user login that returns a validation token',
    }),
    (0, swagger_1.ApiBody)({
        type: auth_1.LoginDto,
        description: 'User credentials for login',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Login success.',
        type: auth_1.LoginResponse,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_request_model_1.AuthRequestModel]),
    __metadata("design:returntype", auth_1.LoginResponse)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.IsPublic)(),
    (0, common_1.Put)('login/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Send password reset email',
        description: 'Send an email to the user with a new random password',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Email address of the user',
        type: reset_password_dto_1.ResetPasswordDto,
    }),
    (0, swagger_1.ApiAcceptedResponse)({
        description: 'Password reset email sent successfully.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetEmail", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map