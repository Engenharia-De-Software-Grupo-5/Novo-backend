import { AddressResponse } from './address.response';
import { PropertyResponse } from './property.response';
export declare class CondominiumResponse {
    id: string;
    name: string;
    description?: string;
    address: AddressResponse;
    properties: PropertyResponse[];
}
