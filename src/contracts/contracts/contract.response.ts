import { ApiProperty } from '@nestjs/swagger';
import { PropertyResponse } from '../condominiums/property.response';
import { TenantResponse } from '../tenants/tenant.response';
import { ContractTemplateResponse } from '../contract.templates/contract.template.response';

export class ContractResponse {
  @ApiProperty({
    description: 'unique contract identifier',
    example: '123',
  })
  id: string; //

  @ApiProperty({
    description: 'Tenant object who detains a property',
    type: () => TenantResponse,
  })
  tenant: TenantResponse;

  @ApiProperty({
    description: 'additional description about this contract',
    example: 'Sample content',
  })
  description?: string; //

  @ApiProperty({
    description: 'property associated with this contract',
    type: () => PropertyResponse,
  })
  property: PropertyResponse;

  @ApiProperty({
    description: 'Content of the contract',
    example: 'Contrato completo',
  })
  content?: string;

  @ApiProperty({
    description: 'Template associated with this contract',
    type: () => ContractTemplateResponse,
  })
  contractTemplate: ContractTemplateResponse;

  @ApiProperty({
    description: 'Contract URL',
    example: 'https://.../.../...',
  })
  contractUrl: string; //

  @ApiProperty({
    description: 'Contract URL',
    example: 'XX/XX/XXXX',
  })
  startDate: string; //

  @ApiProperty({
    description: 'Contract URL',
    example: 'XX/XX/XXXX',
  })
  dueDate: string; //
}
