import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PropertySituation, UnityType } from '@prisma/client';
import { PropertyAddress } from './propertyaddress.dto';

export class PropertyUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Unique identifier for the property, such as a unit number or name (e.g., apartment 101, commercial room 202)',
        example: '101',
    })
    identifier: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Property name',
        example: '',
    })
    name: string;

    @Type(() => PropertyAddress)
    @ValidateNested()
    @ApiProperty({
        description: 'Additional address information for the property, such as proximity to landmarks or specific location details within the condominium',
        example: 'Próximo à casa X, Rua Y, etc.',
    })
    address: PropertyAddress

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Number or name of the property unit (e.g., apartment 101, commercial room 202)',
        example: '101',
    })
    unityNumber: string;

    @IsNotEmpty()
    @IsEnum(UnityType)
    @ApiProperty({
        enum: UnityType,
        enumName: 'UnityType',
        example: UnityType.APARTMENT,
    })
    unityType: UnityType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Obrigatory field for the block of the property, if applicable',
        example: 'bloco 1',
    })
    block?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Obrigatory field for the floor of the property, if applicable',
        example: 3,
    })
    floor?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Numerical field for the total area of the property in square meters',
        example: 10,
    })
    totalArea?: number;

    @IsEnum(PropertySituation)
    @ApiProperty({
        enum: PropertySituation,
        enumName: 'PropertySituation',
        example: PropertySituation.ACTIVE,
    })
    propertySituation: PropertySituation;

    @ApiProperty({
        description: 'List of file names to keep in the system',
    })
    filesToKeep: string[];

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Optional field for any additional observations about the property',
        example: 'bloco 1',
    })
    observations?: string;
}