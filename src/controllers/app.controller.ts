import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser, IsPublic } from 'src/common/decorators';
import { AuthPayload } from 'src/contracts/auth';
import { AuthJwtResponse } from 'src/contracts/auth/jwt.response';
import { AppService } from 'src/services/app.service';
import { MinioClientService } from 'src/services/tools/minio-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly minioClientService: MinioClientService,
  ) {}

  @Get()
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Current user info',
    description: 'Returns login info about current user.',
  })
  @ApiOkResponse({
    description: 'Success',
    type: AuthJwtResponse,
  })
  getMe(@CurrentUser() user: AuthPayload): AuthJwtResponse {
    const {
      sub: id,
      email,
      name,
      permission,
      condominium,
      isAdminMaster,
    } = user;
    return {
      id,
      email,
      name,
      permission,
      condominium,
      isAdminMaster,
    };
  }

  @Post('files/upload')
  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('Nenhum arquivo enviado.');
    }
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];
    return this.minioClientService.uploadFile(
      file,
      allowedExtensions,
      file.originalname,
    );
  }

  @Get('files/*fileName')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gera uma URL temporária para acessar um arquivo' })
  async getFileAccessUrl(@Param('fileName') fileName: string) {
    const url = await this.minioClientService.getFileUrl(fileName);
    return { url };
  }

  @Delete('files/*fileName')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a file from storage' })
  async deleteFile(@Param('fileName') fileName: string) {
    await this.minioClientService.deleteFile(fileName);
    return { message: `Arquivo '${fileName}' deletado com sucesso.` };
  }
}
