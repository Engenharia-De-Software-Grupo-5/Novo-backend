import { PropertyResponse } from "../condominiums/property.dto.response";
import { OwnerResponse } from "../owner/owner.response";

export class ContractResponse {
  id: string;
  owner: OwnerResponse;
  descricao?: string;
  propertie: PropertyResponse 
}
