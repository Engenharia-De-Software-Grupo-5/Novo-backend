import { ApiProperty } from "@nestjs/swagger";
import { PropertyResponse } from "../condominiums/property.response";
import { TenantResponse } from "../tenants/tenant.response";
import { ContractTemplateResponse } from "../contract.templates/contract.template.response";

export class ContractResponse {
  @ApiProperty({
      description: 'unique contract identifier',
      example: '123',
    })
    id: string;

  @ApiProperty({
      description: 'Tenant object who detains a property ',
      example: TenantResponse,
    }) 
  tenant: TenantResponse;

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

  @ApiProperty({
      description: 'Template associated with this contract',
      example: ContractTemplateResponse,
    })
  contractTemplate: ContractTemplateResponse 

  @ApiProperty({
      description: 'Template associated with this contract',
      example: 'https://.../.../...',
    })
  contractUrl: string 
}
