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
    let fileNamesList: string[] = [];

    // Proteção: Só tenta fazer upload se a array de arquivos existir e tiver itens
    if (files && files.length > 0) {
      const uploadResponses = await Promise.all(
        files.map((file) =>
          this.minioClientService.uploadFile(
            file,
            allowedExtensions,
            file.originalname,
          ),
        ),
      );
      fileNamesList = uploadResponses.map((r) => r.fileName);
    }

    const result = await this.repo.create(
      {
        ...dto,
        expenseDate: new Date(dto.expenseDate),
        condominiumId,
        fileNamesList,
      } as any,
      fileNamesList,
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
    let newFileNamesList: string[] = [];

    // Proteção: Verifica se tem arquivos novos
    if (files && files.length > 0) {
      const uploadResponses = await Promise.all(
        files.map((file) =>
          this.minioClientService.uploadFile(
            file,
            allowedExtensions,
            file.originalname,
          ),
        ),
      );
      newFileNamesList = uploadResponses.map((r) => r.fileName);
    }

    // Salvamos o resultado da atualização numa variável
    const updatedExpense = await this.repo.update(
      id,
      {
        ...dto,
        expenseDate: new Date(dto.expenseDate),
        newFiles: files, // CORREÇÃO AQUI: Passar a variável 'files' em vez de 'dto.files'
        filesToKeep: dto.filesToKeep || [], // Proteção garantindo array
      },
      newFileNamesList,
    );

    // ADIÇÃO AQUI: Traduzir os links internos do banco para URLs temporárias do MinIO
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
