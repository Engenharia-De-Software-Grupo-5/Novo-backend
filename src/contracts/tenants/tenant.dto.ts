import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsCPF } from 'class-validator-cpf';
import { TenantStatus } from '@prisma/client';
import { SpouseDto } from './spouse.dto';
import { ProfessionalInfoDto } from './professionalInfo.dto';
import { EmergencyContactDto } from './emergencyContact.dto';
import { AdditionalResidentDto } from './additionalResident.dto';
import { TenantDocumentDto } from './tenantDocument.dto';
import { BankingInfoDto } from './bankingInfo.dto';


import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class TenantDto {
  @IsCPF()
  @ApiProperty({
    description: 'Tenant CPF (numbers only)',
    example: '17508074084',
  })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full name of the tenant',
    example: 'Pedro Pereira',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Tenant rg (numbers only)',
    example: '123456789',
  })
  rg: string;

  @IsEmail()
  @ApiProperty({
    description: 'Tenant issuing authority for RG',
    example: 'SSP/PE',
  })
  issuingAuthority: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tenant birth date in string format',
    example: '1995-03-15',
  })
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Marital status of the tenant',
    example: 'Single',
  })
  maritalStatus: string;

  @IsNumber()
  @ApiProperty({
    description: 'Monthly income of the tenant',
    example: 5000,
  })
  monthlyIncome: number;

  @IsEmail()
  @ApiProperty({
    description: 'Tenant email address',
    example: 'pedro@email.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Primary phone number',
    example: '+55 83 99999-0000',
  })
  primaryPhone: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Secondary phone number',
    example: '+55 83 98888-0000',
  })
  secondaryPhone?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tenant address',
    example: '123 Main St, Apt 4B, Cityville',
  })
  address: string;

  @IsEnum(TenantStatus)
  @ApiProperty({
    description: 'Current tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  @ApiPropertyOptional({
    description: 'List of emergency contacts',
    type: () => EmergencyContactDto,
    isArray: true,
  })
  emergencyContacts?: EmergencyContactDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfessionalInfoDto)
  @ApiPropertyOptional({
    description: 'Professional information of the tenant',
    type: () => ProfessionalInfoDto,
  })
  professionalInfo?: ProfessionalInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankingInfoDto)
  @ApiPropertyOptional({
    description: 'Banking information of the tenant',
    type: () => BankingInfoDto,
  })
  bankingInfo?: BankingInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpouseDto)
  @ApiPropertyOptional({
    description: 'Spouse information (if applicable)',
    type: () => SpouseDto,
  })
  spouse?: SpouseDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalResidentDto)
  @ApiPropertyOptional({
    description: 'Additional residents living with the tenant',
    type: () => AdditionalResidentDto,
    isArray: true,
  })
  additionalResidents?: AdditionalResidentDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TenantDocumentDto)
  @ApiPropertyOptional({
    description: 'Tenant document references',
    type: () => TenantDocumentDto,
  })
  documents?: TenantDocumentDto;
}