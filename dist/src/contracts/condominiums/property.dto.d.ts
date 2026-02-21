import { PropertySituation, UnityType } from '@prisma/client';
export declare class PropertyDto {
    identifier: string;
    address: string;
    unityNumber: string;
    unityType: UnityType;
    block?: string;
    floor?: number;
    totalArea?: number;
    propertySituation: PropertySituation;
    observations?: string;
}
