import { Injectable, NotFoundException } from '@nestjs/common'

import { ContractRepository } from '../../repositories/contracts/contract.repository'

import { TemplateEngineService } from './template-engine.service'
import { PdfGeneratorService } from './pdf-generator.service'
import { MinioClientService } from './minio-client.service'


@Injectable()
export class GenerateContractService {
    constructor(
        private readonly contractsRepository: ContractRepository,
        private readonly templateEngine: TemplateEngineService,
        private readonly pdfGenerator: PdfGeneratorService,
        private readonly minioService: MinioClientService,
    ) { }

    async execute(contractId: string): Promise<{ url: string }> {

        const contract = await this.contractsRepository.getById(contractId);
        if (!contract) {
            throw new NotFoundException('Contrato não encontrado');
        }
        const template = contract.contractTemplate
        if (!template) {
            throw new NotFoundException('Template não encontrado');
        }
        const condominium = contract.property.condominium
        if (!condominium) {
            throw new NotFoundException('Condomínio não encontrado');
        }
        const property = contract.property
        if (!property) {
            throw new NotFoundException('Imóvel não encontrado');
        }
        const address = condominium.address
        if (!address) {
            throw new NotFoundException('Endereço não encontrado');
        }

        const templateData = {
            imovel: {
                endereco: `${property.address}, ${address.street}, ${address.number} - ${address.city}/${address.uf}`,
            },

            condominio: {
                nome: condominium.name,
            },

            propriedade: {
                numero: property.unityNumber,
                tipo: property.unityType,
                bloco: property.block,
                andar: property.floor,
                area_total: property.totalArea,
                situacao: property.propertySituation,
                observacoes: property.observations,
            },

            locatario: {
                nome: contract.tenant.name,
                cpf: contract.tenant.cpf,
            },
        };

        const processedMarkdown = this.templateEngine.parse(
            template.template,
            templateData,
        );

        const pdfBuffer = await this.pdfGenerator.generate(processedMarkdown);

        const timeStamp = new Date().getTime()
        const fileName = `${contractId}_${timeStamp}.pdf`;
        const objectPath = `contracts/${fileName}`;

        const url = await this.minioService.uploadFileBuffer(
            pdfBuffer,
            objectPath,
            'application/pdf'
        );

        return { url: url.fileName };
    }
}