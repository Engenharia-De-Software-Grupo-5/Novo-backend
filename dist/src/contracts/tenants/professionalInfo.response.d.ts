import { AddressResponse } from "../condominiums/address.response";
export declare class ProfessionalInfoResponse {
    id: string;
    position: string;
    companyName: string;
    companyPhone: string;
    companyAddress?: AddressResponse;
    monthsWorking: number;
}
