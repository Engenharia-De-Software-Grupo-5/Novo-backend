import { ContractResponse } from "../contracts/contract.response";

export class OwnerResponse {
  id: string;
  name: string;
  contracts: ContractResponse[];
}