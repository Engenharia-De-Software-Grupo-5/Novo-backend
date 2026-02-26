import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CondominiumResponse } from "src/contracts/condominiums/condominium.response";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { PaginatedResponseSchema } from "src/contracts/pagination/swagger.paginated.schema";
import { ContractTemplateService } from "src/services/contract.templates/contract.template.service";

@ApiTags('ContractTemplates')
@ApiBearerAuth('access-token')
@Controller('contracttemplates')
export class ContractTemplateController {
    constructor(private readonly contractTemplateService: ContractTemplateService) { }

    @ApiQuery({
        name: 'name',
        type: String,
        required: false
    })
    @Get()
    getAll(@Query('name') name?: string): Promise<ContractTemplateResponse[]> {
        return this.contractTemplateService.getAll(name)
    }

    @Get('paginated')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get contract templates filtered and paginated',
        description: 'Get contract templates filtered and paginated',
    })
    @ApiOkResponse({
        description: 'Success',
        schema: PaginatedResponseSchema(ContractTemplateResponse),
    })
    getPaginated(
    @Query() data: PaginationDto,
    ): Promise<PaginatedResult<ContractTemplateResponse>> {
        return this.contractTemplateService.getPaginated(data);
    }

    @Get(':id')
    getById(@Param('id') contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.getById(contractTemplateId)
    }

    @Post()
    create(@Body() dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.create(dto)
    }

    @Put(':id')
    update(
        @Param('id') contractTemplateId: string,
        @Body() dto: ContractTemplateDto): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.update(contractTemplateId, dto)
    }

    @Delete(':id')
    delete(@Param('id') contractTemplateId: string): Promise<ContractTemplateResponse> {
        return this.contractTemplateService.delete(contractTemplateId)
    }
}