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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_repository_1 = require("../../repositories/auth/auth.repository");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    login(user) {
        console.log(user);
        const payload = {
            sub: user.id,
            email: user.email,
            cpf: user.cpf,
            name: user.name,
            permission: user.permission.id,
        };
        const jwtToken = this.jwtService.sign(payload);
        return {
            access_token: jwtToken,
            name: user.name,
        };
    }
    async validateUser(userLogin, recievedPassword) {
        let user;
        try {
            if (!userLogin.includes('@'))
                userLogin = userLogin.replace(/[.-]/g, '');
            user = await this.authRepository.getUserByEmailOrCpf(userLogin);
            if (user == null)
                throw new common_1.UnauthorizedException();
            const isMatch = await bcrypt.compare(recievedPassword, user.password);
            if (!isMatch)
                throw new common_1.UnauthorizedException();
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Incorrect email/cpf and/or password.');
        }
        return { ...user, password: undefined };
    }
    async passwordResetEmail(email) {
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await this.authRepository.getUserByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found.');
        await this.authRepository.updateUserPassword(user, hashedPassword);
        return newPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map