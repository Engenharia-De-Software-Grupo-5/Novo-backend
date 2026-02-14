import { AddressResponse } from './address.response';

export class CondominiumResponse {
  id: string;
  name: string;
  description?: string;
  address: AddressResponse;
}
