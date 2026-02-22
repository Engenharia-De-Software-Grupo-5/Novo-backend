import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ContractTemplateDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Nome do modelo do contrato',
        example: 'Contrato de locação 2026',
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Descrição do modelo do contrato',
        example: 'Modelo de contrato utilizado para locação residencial',
    })
    description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Template do contrato com placeholders',
        example: 'Contrato firmado entre ¿nomeLocatario¿ e ¿nomeLocador¿ no valor de ¿valorAluguel¿',
    })
    template: string
}
