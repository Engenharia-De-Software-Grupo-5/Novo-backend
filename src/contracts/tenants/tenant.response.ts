import { ApiProperty } from "@nestjs/swagger";

export class TenantResponse {
   @ApiProperty({
      description: 'Tenant ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
  id: string;

      @ApiProperty({
      description: 'Tenant CPF',
      example: '17508074084',
    })
  cpf: string;

    @ApiProperty({
      description: 'Tenant name',
      example: 'John Doe',
    })
  name: string;
}
