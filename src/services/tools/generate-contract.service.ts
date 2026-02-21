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
            condominiumName: condominium.name,
            condominiumAddress: condominium.address,
            propertyAddress: property.address,
            propertyNumber: property.unityNumber,
            propertyUnityType: property.unityType,
            propertyBlock: property.block,
            propertyFloor: property.floor,
            propertyTotalArea: property.totalArea,
            propertySituation: property.propertySituation,
            propertyObservations: property.observations,
            addressZip: address.zip,
            addressStreet: address.street,
            addressNeighborhood: address.neighborhood,
            addressCity: address.city,
            addressUf: address.uf,
            addressNumber: address.number,
            addressComplement: address.complement,

        }

        const processedHtml = this.templateEngine.parse(
            template.template,
            templateData,
        );

        const pdfBuffer = await this.pdfGenerator.generate(processedHtml);

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