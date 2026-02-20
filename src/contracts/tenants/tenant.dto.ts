import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"
import { IsCPF } from "class-validator-cpf"

export class TenantDto {
    @IsCPF()
    @IsNotEmpty()
    @ApiProperty({
        description: "Obrigatory field for tenant's cpf (just numbers)",
        example: '17508074084',
    })
    cpf: string;

     @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Obrigatory field for tenant's name",
        example: 'John Doe',
    })
    name: string;

}