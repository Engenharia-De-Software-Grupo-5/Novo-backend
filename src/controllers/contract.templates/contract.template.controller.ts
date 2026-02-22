import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ContractTemplateDto } from "src/contracts/contract.templates/contract.template.dto";
import { ContractTemplateResponse } from "src/contracts/contract.templates/contract.template.response";
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