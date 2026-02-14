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
}
