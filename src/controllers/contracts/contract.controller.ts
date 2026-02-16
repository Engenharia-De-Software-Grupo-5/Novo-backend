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
import { ContractDto } from 'src/contracts/contracts/contract.dto';
import { ContractResponse } from 'src/contracts/contracts/contract.response';
import { ContractService } from 'src/services/contracts/contract.service';

@ApiTags('Contracts')
@ApiBearerAuth('access-token')
@Controller('contracts')
export class ContratoController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all contracts',
    description: 'Retrieve all contracts registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all contracts',
    type: [ContractResponse],
  })
  getAll(): Promise<ContractResponse[]> {
    return this.contractService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get contract by ID',
    description:
      'Retrieve details of a specific contract identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved contract details',
    type: ContractResponse,
  })
  getById(@Param('id') ContratoId: string): Promise<ContractResponse> {
    return this.contractService.getById(ContratoId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new contract',
    description: 'Register a new contract in the system.',
  })
  @ApiBody({
    description: 'contract data to be registered',
    type: ContractDto,
  })
  @ApiCreatedResponse({
    description: 'contract successfully created',
    type: ContractResponse,
  })
  create(@Body() dto: ContractDto): Promise<ContractResponse> {
    return this.contractService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing contract',
    description:
      'Update the data of an existing contract identified by its ID.',
  })
  @ApiBody({
    description: 'Updated contract data',
    type: ContractDto,
  })
  @ApiOkResponse({
    description: 'contract successfully updated',
    type: ContractResponse,
  })
  update(
    @Param('id') id: string,
    @Body() dto: ContractDto,
  ): Promise<ContractResponse> {
    return this.contractService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a contract',
    description: 'Perform a soft delete of a contract identified by its ID.',
  })
  @ApiOkResponse({
    description: 'contract successfully deleted',
    type: ContractResponse,
  })
  delete(@Param('id') ContractId: string): Promise<ContractResponse> {
    return this.contractService.delete(ContractId);
  }
}
