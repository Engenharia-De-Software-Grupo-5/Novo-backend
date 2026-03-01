import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PropertySituation, UnityType } from "@prisma/client";
import { CondominiumResponse } from "./condominium.response";
import { PropertyAddressResponse } from "./propertyaddress.response";
import { PropertyFilesResponse } from "./propertyfiles.response.dto";

export class PropertyResponse {
     @ApiProperty({
        description: 'Property ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      })
    id: string;
        @ApiProperty({
        description: 'Property identifier',
        example: '123456789',
      })
    identifier: string;
        @ApiProperty({
        description: 'Property address',
        example: 'Monitas Street, 123',
      })
    propertyAddress: PropertyAddressResponse;
        @ApiProperty({
        description: 'Property unity number',
        example: '101',
      })
    unityNumber: string;
        @ApiProperty({
        description: 'Property unity type',
        example: 'APARTMENT',
      })
    unityType: UnityType;
    
    propertySituation: PropertySituation;
        @ApiPropertyOptional({
        description: 'Additional observations about the property',
        example: 'This is a corner unit with great natural light.',
      })
      observations?: string;
      
      @ApiPropertyOptional({
      description: 'Additional observations about the property',
      example: 'This is a corner unit with great natural light.',
    })
    condominium: CondominiumResponse;

    @ApiProperty()
    files: PropertyFilesResponse[]
}