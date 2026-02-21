import { ApiProperty } from "@nestjs/swagger";
import { PropertyResponse } from "../condominiums/property.response";
import { OwnerResponse } from "../owner/owner.response";
import { TenantResponse } from "../tenants/tenant.response";

export class ContractResponse {
  @ApiProperty({
      description: 'unique contract identifier',
      example: '123',
    })
    id: string;

  @ApiProperty({
      description: 'Owner object who detains a property ',
      example: OwnerResponse,
    }) 
  owner: OwnerResponse;

  @ApiProperty({
      description: 'additional description about this contract',
      example: 'Sample content',
    })
  descricao?: string;

  @ApiProperty({
      description: 'property associated with this contract',
      example: PropertyResponse,
    })
  property: PropertyResponse 
}
