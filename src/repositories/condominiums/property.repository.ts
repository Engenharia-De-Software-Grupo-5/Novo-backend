import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/database/prisma.service";
import { PropertyDto } from "src/contracts/condominiums/property.dto";
import { PropertyResponse } from "src/contracts/condominiums/property.response";
import { PropertyUpdateDto } from "src/contracts/condominiums/property.update.dto";
import { PaginatedResult } from "src/contracts/pagination/paginated.result";
import { PaginationDto } from "src/contracts/pagination/pagination.dto";
import { buildDynamicWhere } from "src/contracts/pagination/prisma.utils";

@Injectable()
export class PropertyRepository {

  private readonly propertySelect = {
    id: true,
    identifier: true,
    propertyAddress: {
      select: {
        block: true,
        city: true,
        complement: true,
        floor: true,
        id: true,
        neighborhood: true,
        number: true,
        street: true,
        uf: true,
        totalArea: true,
        zip: true
      }
    },
    files: {
      select: {
        link: true,
        name: true,
        id: true,
        type: true
      }
    },
    unityNumber: true,
    unityType: true,
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
            city: true,
            complement: true,
            neighborhood: true,
            number: true,
            street: true,
            uf: true,
            zip: true
          }
        }
      }
    },
  };

  async getPaginated(
    condominiumId: string,
    data: PaginationDto,
  ): Promise<PaginatedResult<PropertyResponse>> {
    const where = buildDynamicWhere(
      data,
      { deletedAt: null, condominiumId },
      {
        enumFields: ['status'],
        customMappings: {
          permissionName: (content) => ({
            permission: { name: { contains: content, mode: 'insensitive' } },
          }),
        },
      },
    );

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.properties.count({
        where,
      }),
      this.prisma.properties.findMany({
        where,
        select: this.propertySelect,
        take: data.limit,
        skip: (data.page - 1) * data.limit,
        orderBy: { identifier: 'asc' },
      }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / data.limit),
        page: data.page,
        limit: data.limit,
      },
    };
  }
  constructor(private prisma: PrismaService) { }

  // getAll, getById, create, update, delete
  getAll(condominiumId: string): Promise<PropertyResponse[]> {
    return this.prisma.properties.findMany({
      where: { deletedAt: null, condominiumId },
      select: {
        ...this.propertySelect
      }
    })
  }

  getById(
    condominiumId: string,
    propertyId: string,
  ): Promise<PropertyResponse> {
    return this.prisma.properties.findFirst({
      where: { id: propertyId, deletedAt: null, condominiumId },
      select: {
        ...this.propertySelect,
      },
    });
  }
  getByIdentificador(
    condominiumId: string,
    identifier: string,
  ): Promise<PropertyResponse> {
    return this.prisma.properties.findUnique({
      where: { identifier, condominiumId, deletedAt: null },
      select: {
        ...this.propertySelect,
      },
    });
  }
  create(
    condominiumId: string,
    dto: PropertyDto,
    inspectionFileNameList: string[],
    documentFileNameList: string[],
    inspectionFiles: Express.Multer.File[],
    documentFiles: Express.Multer.File[]
  ): Promise<PropertyResponse> {
    const { address, ...propertyData } = dto;

    return this.prisma.properties.create({
      data: {
        ...propertyData,
        condominium: { connect: { id: condominiumId } },
        propertyAddress: {
          create: { ...address }
        },
        files: {
          create: [

            ...inspectionFileNameList.map((link, i) => ({
              link,
              type: 'INSPECTION',
              name: inspectionFiles[i].originalname
            })),

            ...documentFileNameList.map((link, i) => ({
              link,
              type: 'DOCUMENT',
              name: documentFiles[i].originalname
            }))
          ]
        }
      },
      select: this.propertySelect,
    }) as Promise<PropertyResponse>
  }
  update(
    condominiumId: string,
    propertyId: string,
    dto: PropertyUpdateDto,
    inspections: Express.Multer.File[],
    documents: Express.Multer.File[],
    inspectionFileNameList: string[],
    documentFileNameList: string[],
  ): Promise<PropertyResponse> {

    const { filesToKeep, ...propertyData } = dto;

    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId, deletedAt: null },
      data: {
        ...propertyData,

        files: {
          deleteMany: filesToKeep
            ? {
              id: {
                notIn: filesToKeep,
              },
            }
            : {},
          create: [
            ...inspectionFileNameList.map((link, i) => ({
              link,
              type: 'INSPECTION',
              name: inspections[i].originalname
            })),

            ...documentFileNameList.map((link, i) => ({
              link,
              type: 'DOCUMENT',
              name: documents[i].originalname
            }))
          ],
        },
      },
      select: this.propertySelect,
    }) as Promise<PropertyResponse>
  }
  delete(condominiumId: string, propertyId: string): Promise<PropertyResponse> {
    return this.prisma.properties.update({
      where: { id: propertyId, condominiumId },
      data: { deletedAt: new Date() },
      select: {
        ...this.propertySelect,
      },
    });
  }
}
