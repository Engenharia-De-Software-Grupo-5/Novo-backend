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
    private readonly minioClientService: MinioClientService
  ) { }

  async create(dto: ExpenseDto, condominiumId: string) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

    const uploadResponses = await Promise.all(
      dto.files.map(file =>
        this.minioClientService.uploadFile(
          file,
          allowedExtensions,
          file.originalname
        )
      )
    );
    const fileNamesList = uploadResponses.map(r => r.fileName);

    const result = await this.repo.create({
      ...dto,
      expenseDate: new Date(dto.expenseDate),
      condominiumId,
      fileNamesList
    } as any, fileNamesList);

    return result
  }

  async getAll(): Promise<ExpenseResponse[]> {
    const result = await this.repo.getAll();
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].expenseFiles.length; j++) {
        const tempUrl = await this.minioClientService.getFileUrl(result[i].expenseFiles[j].link)
        result[i].expenseFiles[j].link = tempUrl
      }
    }
    return result
  }

  listPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    return this.repo.getPaginated(data);
  }

  async findOne(id: string): Promise<ExpenseResponse> {
    const result = await this.repo.findByIdOrThrow(id);

    for (let i = 0; i < result.expenseFiles.length; i++) {
      const tempUrl = await this.minioClientService.getFileUrl(result.expenseFiles[i].link)
      result.expenseFiles[i].link = tempUrl
    }

    return result
  }

  async update(id: string, dto: ExpenseDto) {

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

    const uploadResponses = await Promise.all(
      dto.files.map(file =>
        this.minioClientService.uploadFile(
          file,
          allowedExtensions,
          file.originalname
        )
      )
    );
    const newFileNamesList = uploadResponses.map(r => r.fileName);

    return this.repo.update(id, {
      ...dto,
      expenseDate: new Date(dto.expenseDate),
      newFiles: dto.files,
      filesToKeep: dto.filesToKeep,
    },
      newFileNamesList);
  }
  remove(id: string) {
    return this.repo.softDelete(id);
  }
}