import { AdressResponse } from './adress.response';
import { PropertyResponse } from './property.dto.response';

export class CondominiumResponse {
  id: string;
  name: string;
  description?: string;
  adress: AdressResponse;
  properties: PropertyResponse[];
}
