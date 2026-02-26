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
var MinioClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioClientService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_minio_client_1 = require("nestjs-minio-client");
const Minio = require("minio");
let MinioClientService = MinioClientService_1 = class MinioClientService {
    minio;
    configService;
    logger = new common_1.Logger(MinioClientService_1.name);
    bucketName;
    publicMinioClient;
    constructor(minio, configService) {
        this.minio = minio;
        this.configService = configService;
        this.bucketName =
            this.configService.getOrThrow('MINIO_BUCKET_NAME');
        if (!this.bucketName) {
            throw new Error('MINIO_BUCKET_NAME não definido no .env');
        }
        this.publicMinioClient = new Minio.Client({
            endPoint: 's3.bemconnect.com.br',
            port: 443,
            useSSL: true,
            accessKey: this.configService.get('MINIO_ACCESS_KEY') || 'minioadmin',
            secretKey: this.configService.get('MINIO_SECRET_KEY') || 'minioadmin',
        });
    }
    async uploadFile(file, allowedExtensions, customFileName) {
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        if (!extension ||
            !allowedExtensions.map((e) => e.toLowerCase()).includes(extension)) {
            throw new common_1.UnsupportedMediaTypeException(`Tipo de arquivo inválido. Permitidos: ${allowedExtensions.join(', ')}`);
        }
        const fileName = customFileName.replace(/\s/g, '_');
        const metaData = { 'Content-Type': file.mimetype };
        try {
            await this.minio.client.putObject(this.bucketName, fileName, file.buffer, file.size, metaData);
            return { fileName };
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Falha no upload do arquivo para o MinIO.');
        }
    }
    async listFiles() {
        return new Promise((resolve, reject) => {
            const fileList = [];
            const stream = this.minio.client.listObjects(this.bucketName, '', true);
            stream.on('data', (obj) => {
                const lastDotIndex = obj.name.lastIndexOf('.');
                const hasExtension = lastDotIndex > 0 && lastDotIndex < obj.name.length - 1;
                fileList.push({
                    fullName: obj.name,
                    fileName: hasExtension
                        ? obj.name.substring(0, lastDotIndex)
                        : obj.name,
                    extension: hasExtension ? obj.name.substring(lastDotIndex + 1) : '',
                });
            });
            stream.on('end', () => resolve(fileList));
            stream.on('error', (err) => reject(err));
        });
    }
    async getFileUrl(fileName, expiry = 60 * 60) {
        try {
            return await this.publicMinioClient.presignedGetObject(this.bucketName, fileName, expiry);
        }
        catch (error) {
            throw new Error(`Não foi possível obter a URL do arquivo: ${error.message}`);
        }
    }
    async deleteFile(fileName) {
        try {
            await this.minio.client.removeObject(this.bucketName, fileName);
        }
        catch (error) {
            throw new Error(`Não foi possível remover o arquivo: ${error.message}`);
        }
    }
    async uploadFileBuffer(buffer, fileName, mimeType) {
        const metaData = { 'Content-Type': mimeType };
        try {
            await this.minio.client.putObject(this.bucketName, fileName, buffer, buffer.length, metaData);
            return { fileName };
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Falha no upload do arquivo para o MinIO.');
        }
    }
};
exports.MinioClientService = MinioClientService;
exports.MinioClientService = MinioClientService = MinioClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_minio_client_1.MinioService,
        config_1.ConfigService])
], MinioClientService);
//# sourceMappingURL=minio-client.service.js.map