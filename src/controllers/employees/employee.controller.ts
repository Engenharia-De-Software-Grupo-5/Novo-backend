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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDto } from 'src/contracts/employees/employee.dto';
import { EmployeeResponse } from 'src/contracts/employees/employee.response';
import { PaginatedResult } from 'src/contracts/pagination/paginated.result';
import { PaginationDto } from 'src/contracts/pagination/pagination.dto';
import { PaginatedResponseSchema } from 'src/contracts/pagination/swagger.paginated.schema';
import { EmployeeService } from 'src/services/employees/employee.service';

@ApiTags('Employees')
@ApiBearerAuth('access-token')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all employees',
    description: 'Retrieve all employees registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all employees',
    type: [EmployeeResponse],
  })
  getAll(): Promise<EmployeeResponse[]> {
    return this.employeeService.getAll();
  }

  @Get('paginated')
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
    @Query() data: PaginationDto,
  ): Promise<PaginatedResult<EmployeeResponse>> {
    return this.employeeService.getPaginated(data);
  }

  @Get(':cpf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List employee by CPF',
    description: 'Retrieve employee registered in the system by CPF.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved employee',
    type: EmployeeResponse,
  })
  getByCpf(@Param('cpf') cpf: string): Promise<EmployeeResponse> {
    return this.employeeService.getByCpf(cpf);
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
  getById(@Param('id') employeeId: string): Promise<EmployeeResponse> {
    return this.employeeService.getById(employeeId);
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
  create(@Body() dto: EmployeeDto): Promise<EmployeeResponse> {
    return this.employeeService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
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
    @Param('id') id: string,
    @Body() dto: EmployeeDto,
  ): Promise<EmployeeResponse> {
    return this.employeeService.update(id, dto);
  }

  @Put(':cpf')
  @HttpCode(HttpStatus.OK)
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
  updateByCpf(
    @Param('cpf') cpf: string,
    @Body() dto: EmployeeDto,
  ): Promise<EmployeeResponse> {
    return this.employeeService.updateByCpf(cpf, dto);
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
  delete(@Param('id') employeeId: string): Promise<EmployeeResponse> {
    return this.employeeService.delete(employeeId);
  }

  @Delete(':cpf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a employee by CPF',
    description: 'Perform a soft delete of a employee identified by its CPF.',
  })
  @ApiOkResponse({
    description: 'Employee successfully deleted',
    type: EmployeeResponse,
  })
  deleteByCpf(@Param('cpf') cpf: string): Promise<EmployeeResponse> {
    return this.employeeService.deleteByCpf(cpf);
  }
}
