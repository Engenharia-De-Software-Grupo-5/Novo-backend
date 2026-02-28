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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ExpenseDto } from 'src/contracts/expenses/expense.dto';
import { ExpenseResponse } from 'src/contracts/expenses/expense.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { ExpenseService } from 'src/services/expenses/expense.service';

@ApiTags('Expenses')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create expense' })
  create(@Param('condId') condominiumId: string, @Body() dto: ExpenseDto) {
    return this.service.create(dto, condominiumId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List expenses' })
  list(): Promise<ExpenseResponse[]> {
    return this.service.getAll();
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get expenses filtered and paginated',
    description: 'Get expenses filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(ExpenseResponse),
  })
  getPaginated(
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    return this.service.listPaginated(data);
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