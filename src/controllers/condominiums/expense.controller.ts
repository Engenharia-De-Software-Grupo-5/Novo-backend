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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath, // <-- 1. Importado aqui
} from '@nestjs/swagger';
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
// 2. ExpenseDto adicionado ao ApiExtraModels para o getSchemaPath funcionar
@ApiExtraModels(PaginatedResult, ExpenseResponse, ExpenseDto)
@Controller('condominios/:condId/expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create expense' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    description: 'Expense data and files',
    schema: {
      type: 'object',
      allOf: [
        { $ref: getSchemaPath(ExpenseDto) },
        {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      ],
    },
  })
  create(
    @Param('condId') condominiumId: string,
    @Body() dto: ExpenseDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.service.create(dto, files, condominiumId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List expenses' })
  list(@Param('condId') condominiumId: string): Promise<ExpenseResponse[]> {
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
    @Param('condId') condominiumId: string,
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<ExpenseResponse>> {
    return this.service.listPaginated(data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expense details' })
  findOne(@Param('condId') condominiumId: string, @Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expense' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    description: 'Expense data and new files',
    schema: {
      type: 'object',
      allOf: [
        { $ref: getSchemaPath(ExpenseDto) },
        {
          properties: {
            files: {
              type: 'array', // <-- Definido como array para aceitar lista
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      ],
    },
  })
  update(
    @Param('condId') condominiumId: string,
    @Param('id') id: string,
    @Body() dto: ExpenseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, dto, files);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense (soft delete)' })
  async remove(
    @Param('condId') condominiumId: string,
    @Param('id') id: string,
  ) {
    await this.service.remove(id);
  }
}
