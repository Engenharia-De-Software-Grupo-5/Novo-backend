import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpenseDto } from 'src/contracts/expenses/expense.dto';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';
import { MinioClientService } from '../tools/minio-client.service';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly repo: ExpenseRepository,
    private readonly minioClientService: MinioClientService,
  ) {}

  async create(
    dto: ExpenseDto,
    files: Express.Multer.File[],
    condominiumId: string,
  ) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

    // Array de objetos para guardar o link do minio e as infos originais
    let uploadedFilesData: {
      link: string;
      originalName: string;
      type: string;
    }[] = [];

    if (files && files.length > 0) {
      uploadedFilesData = await Promise.all(
        files.map(async (file) => {
          const timestamp = Date.now();
          const lastDotIndex = file.originalname.lastIndexOf('.');

          const namePart =
            lastDotIndex !== -1
              ? file.originalname.substring(0, lastDotIndex)
              : file.originalname;
          const extPart =
            lastDotIndex !== -1
              ? file.originalname.substring(lastDotIndex)
              : '';

          const newFileName = `${namePart}_${timestamp}${extPart}`;

          const uploadResponse = await this.minioClientService.uploadFile(
            file,
            allowedExtensions,
            newFileName,
          );

          return {
            link: uploadResponse.fileName,
            originalName: file.originalname,
            type: '',
          };
        }),
      );
    }

    // Passamos o DTO formatado e a lista de arquivos estruturada
    const result = await this.repo.create(
      {
        ...dto,
        expenseDate: new Date(dto.expenseDate),
        condominiumId,
      } as any,
      uploadedFilesData,
    );

    return result;
  }

  async getAll(): Promise<ExpenseResponse[]> {
    const result = await this.repo.getAll();
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].expenseFiles.length; j++) {
        const tempUrl = await this.minioClientService.getFileUrl(
          result[i].expenseFiles[j].link,
        );
        result[i].expenseFiles[j].link = tempUrl;
      }
    }
    return result;
  }

  listPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    return this.repo.getPaginated(data);
  }

  async findOne(id: string): Promise<ExpenseResponse> {
    const result = await this.repo.findByIdOrThrow(id);

    for (let i = 0; i < result.expenseFiles.length; i++) {
      const tempUrl = await this.minioClientService.getFileUrl(
        result.expenseFiles[i].link,
      );
      result.expenseFiles[i].link = tempUrl;
    }

    return result;
  }

  async update(id: string, dto: ExpenseDto, files: Express.Multer.File[]) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

    let uploadedFilesData: {
      link: string;
      originalName: string;
      type: string;
    }[] = [];

    // 1️⃣ Upload dos novos arquivos
    if (files && files.length > 0) {
      uploadedFilesData = await Promise.all(
        files.map(async (file) => {
          const timestamp = Date.now();
          const lastDotIndex = file.originalname.lastIndexOf('.');

          const namePart =
            lastDotIndex !== -1
              ? file.originalname.substring(0, lastDotIndex)
              : file.originalname;

          const extPart =
            lastDotIndex !== -1
              ? file.originalname.substring(lastDotIndex)
              : '';

          const newFileName = `${namePart}_${timestamp}${extPart}`;

          const uploadResponse = await this.minioClientService.uploadFile(
            file,
            allowedExtensions,
            newFileName,
          );

          return {
            link: uploadResponse.fileName,
            originalName: file.originalname,
            type: file.mimetype,
          };
        }),
      );
    }

    // 2️⃣ Chama repository passando estrutura pronta
    const updatedExpense = await this.repo.update(
      id,
      {
        ...dto,
        expenseDate: new Date(dto.expenseDate),
        filesToKeep: dto.filesToKeep || [],
      } as any,
      uploadedFilesData,
    );

    // 3️⃣ Converter links para URL temporária
    for (let i = 0; i < updatedExpense.expenseFiles.length; i++) {
      const tempUrl = await this.minioClientService.getFileUrl(
        updatedExpense.expenseFiles[i].link,
      );
      updatedExpense.expenseFiles[i].link = tempUrl;
    }

    return updatedExpense;
  }

  remove(id: string) {
    return this.repo.softDelete(id);
  }
}
