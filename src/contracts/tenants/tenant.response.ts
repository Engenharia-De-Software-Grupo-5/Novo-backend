import { ApiProperty } from "@nestjs/swagger";
import { EmergencyContactResponse } from "./emergencyContact.response";
import { TenantDocumentResponse } from "./tenantDocument.response";
import { ProfessionalInfoResponse } from "./professionalInfo.response";
import { BankingInfoResponse } from "./bankingInfo.response";
import { SpouseResponse } from "./spouse.response";
import { AdditionalResidentResponse } from "./additionalResident.response";
import { AddressResponse } from "../condominiums/address.response";

export class TenantResponse {
  @ApiProperty({
    description: 'Tenant unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tenant full name',
    example: 'Maria Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Tenant CPF (numbers only)',
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'Tenant RG (numbers only)',
    example: '123456789',
  })
  rg: string;

  @ApiProperty({
    description: 'Tenant issuing authority for RG',
    example: 'SSP/PE',
  })
  issuingAuthority: string;

  @ApiProperty({
    description: 'Tenant marital status',
    example: 'Married',
  })
  maritalStatus: string;

  @ApiProperty({
    description: 'Tenant email address',
    example: 'maria.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Tenant phone number',
    example: '+5511999999999',
  })
  primaryPhone: string;

  @ApiProperty({
    description: 'Tenant secondary phone number',
    example: '+5511988888888',
  })
  secondaryPhone?: string;

  @ApiProperty({
    description: 'Tenant birth date',
    example: '1995-03-15',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Tenant monthly income',
    example: 5000,
  })
  monthlyIncome: number;

  @ApiProperty({
    description: 'Tenant status',
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: 'Tenant spouse information',
    type: () => SpouseResponse,
  })
  spouse?: SpouseResponse;

  @ApiProperty({
    description: 'Tenant additional residents',
    type: () => [AdditionalResidentResponse],
  })
  additionalResidents?: AdditionalResidentResponse[];

  @ApiProperty({
    description: 'Tenant professional information',
    type: () => ProfessionalInfoResponse,
  })
  professionalInfo?: ProfessionalInfoResponse;

  @ApiProperty({
    description: 'Tenant banking information',
    type: () => BankingInfoResponse,
  })
  bankingInfo?: BankingInfoResponse;

  @ApiProperty({
    description: 'Tenant emergency contacts',
    type: () => [EmergencyContactResponse],
  })
  emergencyContacts?: EmergencyContactResponse[];

  @ApiProperty({
    description: 'Tenant documents',
    type: () => [TenantDocumentResponse],
  })
  documents?: TenantDocumentResponse;

  @ApiProperty({
    description: 'Tenant address',
    example: '123 Main St, Apt 4B, Cityville',
  })
  address?: string;

  
  @ApiProperty({
    description: 'Tenant condominium ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  condominiumId: string;
}