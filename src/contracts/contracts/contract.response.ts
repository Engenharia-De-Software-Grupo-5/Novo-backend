import { ApiProperty } from "@nestjs/swagger";
import { PropertyResponse } from "../condominiums/property.dto.response";
import { OwnerResponse } from "../owner/owner.response";

export class ContractResponse {
  @ApiProperty({
      description: 'unique contract identifier',
      example: '123',
    })
    id: string;

  @ApiProperty({
      description: 'Owner object who detains a property ',
      example: 'Owner{id: 1, identifier: 012345678910}',
    }) 
  owner: OwnerResponse;

  @ApiProperty({
      description: 'additional description about this contract',
      example: 'conteúdo de exemplo',
    })
  descricao?: string;

  @ApiProperty({
      description: 'property associated with this contract',
      example: 'conteúdo de exemplo',
    })
  property: PropertyResponse 
}
