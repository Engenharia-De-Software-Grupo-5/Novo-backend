import { PropertySituation, UnityType } from "@prisma/client";

export class PropertyResponse {
    id: string
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