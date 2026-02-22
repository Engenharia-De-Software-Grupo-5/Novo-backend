import { Module } from "@nestjs/common";
import { ContractTemplateController } from "src/controllers/contract.templates/contract.template.controller";
import { ContractTemplateRepository } from "src/repositories/contract.templates/contract.template.repository";
import { ContractTemplateService } from "src/services/contract.templates/contract.template.service";

@Module({
    imports: [],
    controllers: [ContractTemplateController],
    providers: [ContractTemplateService, ContractTemplateRepository],
})
export class ContractTemplateModule { }
