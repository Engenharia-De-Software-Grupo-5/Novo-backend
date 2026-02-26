export interface EmployeeContractFront {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export class EmployeeSummaryFrontResponse {
  id: string;
  name: string;
  role: string;
  status: string;
  lastContract?: EmployeeContractFront;
}

export class EmployeeDetailFrontResponse extends EmployeeSummaryFrontResponse {
  cpf: string;
  email?: string;
  phone?: string;
  address?: string;

  birthDate: string;
  admissionDate?: string;

  contracts?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}