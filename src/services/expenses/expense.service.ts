import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpenseDto } from 'src/contracts/expenses/expense.dto';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';

@Injectable()
export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  create(dto: ExpenseDto) {
    return this.repo.create({
      ...dto,
      expenseDate: new Date(dto.expenseDate),
    } as any);
  }

  list() {
    return this.repo.findAll();
  }

  listPaginated(
    data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    return this.repo.getPaginated(data);
  }

  findOne(id: string) {
    return this.repo.findByIdOrThrow(id);
  }

  update(id: string, dto: ExpenseDto) {
    return this.repo.update(id, {
      ...dto,
      expenseDate: new Date(dto.expenseDate),
    } as any);
  }

  remove(id: string) {
    return this.repo.softDelete(id);
  }
}