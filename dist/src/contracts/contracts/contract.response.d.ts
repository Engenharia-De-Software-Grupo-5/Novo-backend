import { PropertyResponse } from '../condominiums/property.response';
import { TenantResponse } from '../tenants/tenant.response';
import { ContractTemplateResponse } from '../contract.templates/contract.template.response';
export declare class ContractResponse {
    id: string;
    tenant: TenantResponse;
    description?: string;
    property: PropertyResponse;
    contractTemplate: ContractTemplateResponse;
    contractUrl: string;
}
