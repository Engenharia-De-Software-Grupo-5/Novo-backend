import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { ExpenseDto } from 'src/contracts/expenses/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  create(dto: ExpenseDto, condominiumId: string) {
    return this.repo.create({
      ...dto,
      expenseDate: new Date(dto.expenseDate),
      condominiumId
    } as any);
  }

  list() {
    return this.repo.findAll();
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