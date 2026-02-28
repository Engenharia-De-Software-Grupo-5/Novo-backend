import { Injectable, NotFoundException } from "@nestjs/common";
import { PreviewContractDto } from "src/contracts/contracts/preview.contract.dto";
import { ContractTemplateRepository } from "src/repositories/contract.templates/contract.template.repository";
import { TemplateEngineService } from "../tools/template-engine.service";
import * as marked from 'marked';
import { ContractDto } from "src/contracts/contracts/contract.dto";
import { GenerateContractService } from "../tools/generate-contract.service";
import { MinioClientService } from "../tools/minio-client.service";
// import DOMPurify from 'dompurify';
// import { JSDOM } from 'jsdom';


@Injectable()
export class PreviewContractService {

    constructor(
        private readonly templateRepository: ContractTemplateRepository,
        private readonly templateEngine: TemplateEngineService,
        private readonly generateContract: GenerateContractService,
        private readonly minioService: MinioClientService,
    ) { }

    async execute(condominiumId: string, dto: PreviewContractDto) {
        const template = await this.templateRepository.getById(condominiumId, dto.templateId);

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

    async executeUrl(
        condominiumId: string,
        dto: PreviewContractDto,
    ): Promise<{ url: string }> {

        if (dto.templateId) {
            const contractUrl = await this.generateContract.executePreview(
                dto.editedMarkdown,
                dto.templateId,
                condominiumId,
            );

            const result = await this.minioService.getFileUrl(contractUrl.url);

            return { url: result };
        }
    }
}