import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.dto.response";

@Injectable()
export class PropertyRepository {
  constructor(private prisma: PrismaService) {}

  // getAll, getById, create, update, delete
  getAll(condominiumId: string): Promise<PropertyResponse[]> {
    return this.prisma.properties.findMany({
      where: { deletedAt: null, condominiumId},
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
  getById(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null, condominiumId},
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
  getByIdentificador(condominiumId: string, identifier: string): Promise<PropertyResponse> {
    return this.prisma.properties.findUnique({
      where: { identifier, condominiumId},
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
  create(condominiumId: string, dto: PropertyDto): Promise<PropertyResponse> {
    return this.prisma.properties.create({
      data: { ...dto, condominiumId},
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
  update(condominiumId: string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse> {
    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId},
      data: { ...dto },
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
  delete(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId},
      data: { deletedAt: new Date() },
      select: {
        id: true,
        identifier: true,
        adress: true,
        unityNumber: true,
        unityType: true,
        block: true,
        floor: true,
        totalArea: true,
        propertySituation: true,
        observations: true,
      },
    });
  }
}
