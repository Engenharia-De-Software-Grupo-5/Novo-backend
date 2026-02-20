import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeePaymentDto } from 'src/contracts/employees/employeePayment.dto';
import { EmployeePaymentResponse } from 'src/contracts/employees/employeePayment.response';
import { EmployeePaymentsService } from 'src/services/employees/employee-payments.service';


@ApiTags('Employee Payments')
@ApiBearerAuth('access-token')
@Controller('employees/:employeeId/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeePaymentsController {
  constructor(private readonly service: EmployeePaymentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Assign payment to employee',
    description: 'Create and assign a payment record to a specific employee.',
  })
  @ApiBody({ type: EmployeePaymentDto })
  @ApiResponse({ status: 200, type: EmployeePaymentResponse })
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('employeeId') employeeId: string,
    @Body() dto: EmployeePaymentDto,
  ): Promise<EmployeePaymentResponse> {
    return this.service.create(employeeId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List employee payment history',
    description: 'Retrieve payment history for an employee.',
  })
  @ApiResponse({ status: 200, type: EmployeePaymentResponse, isArray: true })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('employeeId') employeeId: string,
  ): Promise<EmployeePaymentResponse[]> {
    return this.service.list(employeeId);
  }

  @Delete(':paymentId')
  @ApiOperation({
    summary: 'Delete employee payment',
    description: 'Soft delete a specific payment record for an employee.',
  })
  @ApiResponse({ status: 200, description: 'Employee payment deleted successfully.' })
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('employeeId') employeeId: string,
    @Param('paymentId') paymentId: string,
  ) {
    return this.service.delete(employeeId, paymentId);
  }
}