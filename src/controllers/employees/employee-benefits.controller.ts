import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeeBenefitsService } from 'src/services/employees/employee-benefits.service';
import { EmployeeBenefitDto } from 'src/contracts/employees/employeeBenefit.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { EmployeeBenefitResponse } from 'src/contracts/employees/employeeBenefit.response';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';

@ApiTags('Employee Benefits')
@ApiBearerAuth('access-token')
@Controller('employees/:employeeId/benefits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeBenefitsController {
  constructor(private readonly service: EmployeeBenefitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create vacation or 13th salary record' })
  @ApiBody({ type: EmployeeBenefitDto })
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('employeeId') employeeId: string,
    @Body() dto: EmployeeBenefitDto,
  ) {
    return this.service.create(employeeId, dto);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get service types filtered and paginated',
    description: 'Get service types filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(EmployeeBenefitResponse),
  })
  async listPaginated(
    @Param('employeeId') employeeId: string,
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<EmployeeBenefitResponse>> {
    return this.service.listPaginated(employeeId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List benefits for employee' })
  @HttpCode(HttpStatus.OK)
  async list(@Param('employeeId') employeeId: string) {
    return this.service.list(employeeId);
  }

  @Put(':benefitId')
  @ApiOperation({ summary: 'Update benefit record' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('benefitId') id: string, @Param('employeeId') employeeId: string,  @Body() dto: EmployeeBenefitDto) {
    return this.service.update(id, employeeId, dto);
  }

  @Delete(':benefitId')
  @ApiOperation({ summary: 'Soft delete benefit record' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('benefitId') id: string, @Param('employeeId') employeeId: string) {
    await this.service.remove(id, employeeId);
  }
}