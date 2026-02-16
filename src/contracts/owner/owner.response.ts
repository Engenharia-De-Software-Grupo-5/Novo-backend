import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContractResponse } from "../contracts/contract.response";

export class OwnerResponse {
  @ApiProperty({
      description: 'unique Owner identifier',
      example: '123',
  })
  id: string;

   @ApiProperty({
      description: 'identifier such as cpf',
      example: '012345678910',
  })
  identifier: string;

   @ApiPropertyOptional({
      description: 'owner contracts',
      example: [ContractResponse],
  })
  contracts?: ContractResponse[];
}

