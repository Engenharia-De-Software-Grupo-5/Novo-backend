import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ExpenseDto } from 'src/contracts/expenses/expense.dto';
import { ExpenseService } from 'src/services/expenses/expense.service';

@ApiTags('Expenses')
@ApiBearerAuth('access-token')
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create expense' })
  create(@Body() dto: ExpenseDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List expenses' })
  list() {
    return this.service.list();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expense details' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expense' })
  update(@Param('id') id: string, @Body() dto: ExpenseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense (soft delete)' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}