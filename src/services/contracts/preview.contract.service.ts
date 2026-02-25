import { Injectable, NotFoundException } from "@nestjs/common";
import { PreviewContractDto } from "src/contracts/contracts/preview.contract.dto";
import { ContractTemplateRepository } from "src/repositories/contract.templates/contract.template.repository";
import { TemplateEngineService } from "../tools/template-engine.service";
import * as marked from 'marked';

@Injectable()
export class PreviewContractService {
    constructor(
        private readonly templateRepository: ContractTemplateRepository,
        private readonly templateEngine: TemplateEngineService,
    ) { }

    async execute(dto: PreviewContractDto) {
        const template = await this.templateRepository.getById(dto.templateId);

        if (!template) {
            throw new NotFoundException('Template not found');
        }

        const markdownToProcess = dto.editedMarkdown || template.template;
        const processedMarkdown = this.templateEngine.parse(
            markdownToProcess,
            dto.data,
        );
        const html = marked.parse(processedMarkdown)


        return {
            previewHtml: html,
        };
    }
}