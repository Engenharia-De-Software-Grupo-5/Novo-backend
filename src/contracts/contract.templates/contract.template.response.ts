import { ApiProperty } from "@nestjs/swagger";

export class ContractTemplateResponse {
    @ApiProperty({
        description: 'unique contract identifier',
        example: '123',
    })
    id: string;

    @ApiProperty({
        description: 'Name of the contract template',
        example: 'Contrato de locação 2026'
    })
    name: string;

    @ApiProperty({
        description: 'Description of the contract template',
        example: 'Modelo de contrato utilizado para locação residencial'
    })
    description?: string;

    @ApiProperty({
        description: 'Template of the contract with placeholders',
        example: 'Contrato firmado entre {{nomeLocatario}} e {{nomeLocador}} no valor de {{valorAluguel}}'
    })
    template: string;
}