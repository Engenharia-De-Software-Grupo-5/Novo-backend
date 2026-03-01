import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PropertySituation, UnityType } from "@prisma/client";
import { CondominiumResponse } from "./condominium.response";
import { PropertyAddressResponse } from "./propertyaddress.response";

export class PropertyFilesResponse {
     @ApiProperty({
        description: 'Property ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      })
    id: string;
        @ApiProperty({
        description: '',
        example: '',
      })
    name: string;
        @ApiProperty({
        description: '',
        example: '',
      })
    link: string;
        @ApiProperty({
        description: '',
        example: '',
      })
    type: string;
}