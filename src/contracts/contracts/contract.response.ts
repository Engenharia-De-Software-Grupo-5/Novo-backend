import { PropertyResponse } from "../condominiums/property.dto.response";
import { OwnerResponse } from "../homeOwner/owner.response";

export class ContractResponse {
  id: string;
  owner: OwnerResponse;
  descricao?: string;
  property: PropertyResponse 
}
