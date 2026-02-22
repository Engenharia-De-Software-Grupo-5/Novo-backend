import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.response";

@Injectable()
export class PropertyRepository {
  constructor(private prisma: PrismaService) { }
  private readonly propertySelect = {
    id: true,
    identifier: true,
    address: true,
    unityNumber: true,
    unityType: true,
    block: true,
    floor: true,
    totalArea: true,
    propertySituation: true,
    observations: true,
    condominium: {
      select: {
        id: true,
        name: true,
        description: true,
        address: {
          select: {
            id: true,
            zip: true,
            neighborhood: true,
            city: true,
            complement: true,
            number: true,
            street: true,
            uf: true,
          },
        },
      },
    }
  }

  // getAll, getById, create, update, delete
  getAll(condominiumId: string): Promise<PropertyResponse[]> {
    return this.prisma.properties.findMany({
      where: { deletedAt: null, condominiumId },
      select: {
        ...this.propertySelect
      },
    });
  }
  getById(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null, condominiumId },
      select: {
        ...this.propertySelect
      },
    });
  }
  getByIdentificador(condominiumId: string, identifier: string): Promise<PropertyResponse> {
    return this.prisma.properties.findUnique({
      where: { identifier, condominiumId, deletedAt: null },
      select: {
        ...this.propertySelect
      },
    });
  }
  create(condominiumId: string, dto: PropertyDto): Promise<PropertyResponse> {
    return this.prisma.properties.create({
      data: { ...dto, condominiumId },
      select: {
        ...this.propertySelect
      },
    });
  }
  update(condominiumId: string, propertyId: string, dto: PropertyDto): Promise<PropertyResponse> {
    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId, deletedAt: null },
      data: { ...dto },
      select: {
        ...this.propertySelect
      },
    });
  }
  delete(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId },
      data: { deletedAt: new Date() },
      select: {
        ...this.propertySelect
      },
    });
  }
}
