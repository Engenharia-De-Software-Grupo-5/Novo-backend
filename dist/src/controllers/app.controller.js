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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../common/decorators");
const auth_1 = require("../contracts/auth");
const jwt_response_1 = require("../contracts/auth/jwt.response");
const app_service_1 = require("../services/app.service");
const minio_client_service_1 = require("../services/tools/minio-client.service");
let AppController = class AppController {
    appService;
    minioClientService;
    constructor(appService, minioClientService) {
        this.appService = appService;
        this.minioClientService = minioClientService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getMe(user) {
        const { sub: id, email, name, permission, condominium, isAdminMaster, } = user;
        return {
            id,
            email,
            name,
            permission,
            condominium,
            isAdminMaster,
        };
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.NotFoundException('Nenhum arquivo enviado.');
        }
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];
        return this.minioClientService.uploadFile(file, allowedExtensions, file.originalname);
    }
    async getFileAccessUrl(fileName) {
        const url = await this.minioClientService.getFileUrl(fileName);
        return { url };
    }
    async deleteFile(fileName) {
        await this.minioClientService.deleteFile(fileName);
        return { message: `Arquivo '${fileName}' deletado com sucesso.` };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.IsPublic)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Current user info',
        description: 'Returns login info about current user.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: jwt_response_1.AuthJwtResponse,
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.AuthPayload]),
    __metadata("design:returntype", jwt_response_1.AuthJwtResponse)
], AppController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('files/upload'),
    (0, decorators_1.IsPublic)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File to upload',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('files/*fileName'),
    (0, decorators_1.IsPublic)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Gera uma URL temporária para acessar um arquivo' }),
    __param(0, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFileAccessUrl", null);
__decorate([
    (0, common_1.Delete)('files/*fileName'),
    (0, decorators_1.IsPublic)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file from storage' }),
    __param(0, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        minio_client_service_1.MinioClientService])
], AppController);
//# sourceMappingURL=app.controller.js.map