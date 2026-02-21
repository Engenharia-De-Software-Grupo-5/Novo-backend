import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PropertySituation, UnityType } from "@prisma/client";

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
    address: string;
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
        @ApiPropertyOptional({
        description: 'Property block',
        example: 'A',
      })
    block?: string;
        @ApiPropertyOptional({
        description: 'Property floor',
        example: 1,
      })
    floor?: number;
        @ApiPropertyOptional({
        description: 'Property total area',
        example: 100,
      })
    totalArea?: number;
        @ApiProperty({
        description: 'Property situation',
        example: 'ACTIVE',
      })
    propertySituation: PropertySituation;
        @ApiPropertyOptional({
        description: 'Additional observations about the property',
        example: 'This is a corner unit with great natural light.',
      })
    observations?: string;
}