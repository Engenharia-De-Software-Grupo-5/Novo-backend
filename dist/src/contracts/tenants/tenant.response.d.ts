import { EmergencyContactResponse } from "./emergencyContact.response";
import { TenantDocumentResponse } from "./tenantDocument.response";
import { ProfessionalInfoResponse } from "./professionalInfo.response";
import { BankingInfoResponse } from "./bankingInfo.response";
import { SpouseResponse } from "./spouse.response";
import { AdditionalResidentResponse } from "./additionalResident.response";
import { AddressResponse } from "../condominiums/address.response";
export declare class TenantResponse {
    id: string;
    name: string;
    cpf: string;
    maritalStatus: string;
    email: string;
    primaryPhone: string;
    secondaryPhone?: string;
    birthDate: Date;
    monthlyIncome: number;
    status: string;
    spouse?: SpouseResponse;
    additionalResidents?: AdditionalResidentResponse[];
    professionalInfo?: ProfessionalInfoResponse;
    bankingInfo?: BankingInfoResponse;
    emergencyContacts?: EmergencyContactResponse[];
    documents?: TenantDocumentResponse;
    address?: AddressResponse;
    condominiumId: string;
}
