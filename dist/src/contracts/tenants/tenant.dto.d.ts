import { TenantStatus } from '@prisma/client';
import { SpouseDto } from './spouse.dto';
import { ProfessionalInfoDto } from './professionalInfo.dto';
import { EmergencyContactDto } from './emergencyContact.dto';
import { AdditionalResidentDto } from './additionalResident.dto';
import { TenantDocumentDto } from './tenantDocument.dto';
import { BankingInfoDto } from './bankingInfo.dto';
export declare class TenantDto {
    cpf: string;
    name: string;
    birthDate: Date;
    maritalStatus: string;
    monthlyIncome: number;
    email: string;
    primaryPhone: string;
    secondaryPhone?: string;
    addressId: string;
    condominiumId: string;
    status: TenantStatus;
    emergencyContacts?: EmergencyContactDto[];
    professionalInfo?: ProfessionalInfoDto;
    bankingInfo?: BankingInfoDto;
    spouse?: SpouseDto;
    additionalResidents?: AdditionalResidentDto[];
    documents?: TenantDocumentDto;
}
