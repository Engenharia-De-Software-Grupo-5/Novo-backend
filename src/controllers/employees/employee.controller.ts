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
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { EmployeeService } from 'src/services/employees/employee.service';

@ApiTags('Employees')
@ApiBearerAuth('access-token')
@Controller('condominios/:condId/funcionarios')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get employees filtered and paginated',
    description: 'Get employees filtered and paginated',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: PaginatedResponseSchema(EmployeeResponse),
  })
  getPaginated(
    @Param('condId') condId: string,
    @Query() data: PaginationDto,
  ) {
    return this.employeeService.getPaginated(condId, data);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get employee by ID',
    description:
      'Retrieve details of a specific employee identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved employee details',
    type: EmployeeResponse,
  })
  getById(@Param('condId') condId: string, @Param('id') employeeId: string): Promise<EmployeeResponse> {
    return this.employeeService.getById(condId, employeeId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new employee',
    description: 'Register a new employee in the system.',
  })
  @ApiBody({
    description: 'Employee data to be registered',
    type: EmployeeDto,
  })
  @ApiCreatedResponse({
    description: 'Employee successfully created',
    type: EmployeeResponse,
  })
  create(@Param('condId') condId: string, @Body() dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.employeeService.create(condId, dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Update an existing employee',
    description:
      'Update the data of an existing employee identified by its ID.',
  })
  @ApiBody({
    description: 'Updated employee data',
    type: EmployeeDto,
  })
  @ApiOkResponse({
    description: 'Employee successfully updated',
    type: EmployeeResponse,
  })
  update(
    @Param('condId') condId: string,
    @Param('employeeId') employeeId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('data') data?: string,                
    @Body('existingFileIds') existingFileIds?: string[]
  ): Promise<EmployeeResponse> {
    const dto: EmployeeDto = data ? JSON.parse(data) : {};
    return this.employeeService.update(condId, employeeId, dto, files, existingFileIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a employee',
    description: 'Perform a soft delete of a employee identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Employee successfully deleted',
    type: EmployeeResponse,
  })
  async delete(@Param('condId') condId: string, @Param('id') employeeId: string) {
    await this.employeeService.delete(condId, employeeId);
    return { message: `Employee com id ${employeeId} deletado com sucesso.` }
  }
}
