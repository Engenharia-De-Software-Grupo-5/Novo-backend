import { AddressResponse } from './adress.response';
import { PropertyResponse } from './property.dto.response';

export class CondominiumResponse {
  id: string;
  name: string;
  description?: string;
  address: AddressResponse;
  properties: PropertyResponse[];
}
