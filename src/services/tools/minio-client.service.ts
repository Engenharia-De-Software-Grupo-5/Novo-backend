import {
  Injectable,
  Logger,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';

export interface FileInfo {
  fullName: string;
  fileName: string;
  extension: string;
}

@Injectable()
export class MinioClientService {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly bucketName: string;
  private readonly publicMinioClient: Minio.Client;

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');

    if (!this.bucketName) {
      throw new Error('MINIO_BUCKET_NAME não definido no .env');
    }

    this.publicMinioClient = new Minio.Client({
      endPoint: 's3.bemconnect.com.br',
      port: 443,
      useSSL: true,
      accessKey:
        this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey:
        this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    allowedExtensions: string[],
    customFileName: string,
  ): Promise<{ fileName: string }> {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (
      !extension ||
      !allowedExtensions.map((e) => e.toLowerCase()).includes(extension)
    ) {
      throw new UnsupportedMediaTypeException(
        `Tipo de arquivo inválido. Permitidos: ${allowedExtensions.join(', ')}`,
      );
    }

    const fileName = customFileName.replace(/\s/g, '_');
    const metaData = { 'Content-Type': file.mimetype };

    try {
      await this.minio.client.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );

      return { fileName };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Falha no upload do arquivo para o MinIO.',
      );
    }
  }

  public async listFiles(): Promise<FileInfo[]> {
    return new Promise((resolve, reject) => {
      const fileList: FileInfo[] = [];
      const stream = this.minio.client.listObjects(this.bucketName, '', true);

      stream.on('data', (obj) => {
        const lastDotIndex = obj.name.lastIndexOf('.');
        const hasExtension =
          lastDotIndex > 0 && lastDotIndex < obj.name.length - 1;

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

  public async getFileUrl(
    fileName: string,
    expiry: number = 60 * 60,
  ): Promise<string> {
    try {
      // return await this.minio.client.presignedGetObject(
      //   this.bucketName,
      //   fileName,
      //   expiry,
      // );
      return await this.publicMinioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expiry,
      );
    } catch (error: any) {
      throw new Error(
        `Não foi possível obter a URL do arquivo: ${error.message}`,
      );
    }
  }

  public async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minio.client.removeObject(this.bucketName, fileName);
    } catch (error: any) {
      throw new Error(`Não foi possível remover o arquivo: ${error.message}`);
    }
  }
}
