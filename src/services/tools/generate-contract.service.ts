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

    async execute(condominiumId: string, contractId: string, manualContent?: string): Promise<{ url: string }> {

        const contract = await this.contractsRepository.getById(condominiumId, contractId);
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
        const tenant = contract.tenant
        if (!tenant) {
            throw new NotFoundException('Locatário não encontrado');
        }
        const address = condominium.address
        if (!address) {
            throw new NotFoundException('Endereço não encontrado');
        }

        const templateData = {
            imovel: {
                endereco: `${property.propertyAddress.street}, ${property.propertyAddress.number} - ${address.city}/${address.uf}`,
            },

            condominio: {
                nome: condominium.name,
                endereco: `${condominium.address.street}, ${condominium.address.number} - ${condominium.address.city}/${condominium.address.uf}`,
                descricao: condominium.description,
            },

            propriedade: {
                numero: property.unityNumber,
                tipo: property.unityType,
                bloco: property.propertyAddress.block,
                andar: property.propertyAddress.floor,
                area_total: property.propertyAddress.totalArea,
                situacao: property.propertySituation,
                observacoes: property.observations,
            },

            locatario: {
                nome: contract.tenant.name,
                data_nascimento: contract.tenant.birthDate,
                cpf: contract.tenant.cpf,
                email: contract.tenant.email,
                estado_civil: contract.tenant.maritalStatus,
                renda_mensal: contract.tenant.monthlyIncome,
                telefone_principal: contract.tenant.primaryPhone,
                telefone_secundario: contract.tenant.secondaryPhone,
                profissao: contract.tenant.professionalInfo.position,
                nome_banco: contract.tenant.bankingInfo.bank,   // Falar com arthur, placeholder duplicado
                agencia: contract.tenant.bankingInfo.agency,
                conta: contract.tenant.bankingInfo.accountNumber,
                tipo_conta: contract.tenant.bankingInfo.accountNumber,  // Falar com arthur, melhorar o nome placeholder
                residentes_adicionais: contract.tenant.additionalResidents,
            },
            segundo_proponente: {
                nome: contract.tenant.spouse.name,
                cpf: contract.tenant.spouse.cpf,
                data_nascimento: contract.tenant.spouse.birthDate,
                profissao: contract.tenant.spouse.profession,
                renda_mensal: contract.tenant.spouse.monthlyIncome,
            }
        };

        const baseContent = manualContent || template.template
        const processedMarkdown = this.templateEngine.parse(
            baseContent,
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

    private async generatePdfFromData(
        content: string,
        templateData: any,
        fileName: string,
    ): Promise<{ url: string }> {

        const processedMarkdown = this.templateEngine.parse(
            content,
            templateData,
        );

        const pdfBuffer = await this.pdfGenerator.generate(processedMarkdown);

        const objectPath = `contracts/${fileName}`;

        const upload = await this.minioService.uploadFileBuffer(
            pdfBuffer,
            objectPath,
            'application/pdf'
        );

        return { url: upload.fileName };
    }

    async executePreview(
        content: string,
        templateData: any,
        condominiumId: string,
    ): Promise<{ url: string }> {

        const fileName = `preview_${condominiumId}_${Date.now()}.pdf`;

        return this.generatePdfFromData(content, templateData, fileName);
    }
}