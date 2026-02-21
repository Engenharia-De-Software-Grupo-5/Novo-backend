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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../../repositories/auth/user.repository");
const bcrypt = require("bcrypt");
const mail_service_1 = require("../tools/mail.service");
let UserService = class UserService {
    userRepository;
    mailService;
    constructor(userRepository, mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }
    getAll() {
        return this.userRepository.getAll();
    }
    getById(userId) {
        return this.userRepository.getById(userId);
    }
    getUserPaginated(data) {
        return this.userRepository.getUserPaginated(data);
    }
    async create(userDto) {
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await this.userRepository.create(userDto, hashedPassword);
        try {
            this.mailService.sendMail(userDto.email, 'Credentials for your new account', `To login, use this email: ${userDto.email}\nYour new password is: ${newPassword}\nPlease change it after your first login.`);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to send email.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return result;
    }
    update(userId, userDto) {
        return this.userRepository.update(userId, userDto);
    }
    async updatePassword(userId, userPasswordDto) {
        const user = await this.userRepository.getByIdWithPassword(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found.');
        const isMatch = await bcrypt.compare(userPasswordDto.oldPassword, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException();
        const newPassword = await bcrypt.hash(userPasswordDto.newPassword, 10);
        return this.userRepository.updatePassword(userId, newPassword);
    }
    delete(userId) {
        return this.userRepository.delete(userId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map