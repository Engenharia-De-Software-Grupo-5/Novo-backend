import { ContractResponse } from "../contracts/contract.response";

export class OwnerResponse {
  id: string;
  identifier: string;
  contracts?: ContractResponse[];
}

