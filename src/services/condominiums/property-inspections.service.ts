// import { Injectable } from '@nestjs/common';
// import { randomUUID } from 'node:crypto';
// import { MinioClientService } from 'src/services/tools/minio-client.service';
// import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';

// @Injectable()
// export class PropertyInspectionsService {
//   private readonly allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

//   constructor(
//     private readonly repo: PropertyInspectionsRepository,
//     private readonly minio: MinioClientService,
//   ) {}

//   async upload(condominiumId: string, propertyId: string, file: Express.Multer.File) {
 
//     await this.repo.assertPropertyOwned(condominiumId, propertyId);

//     const extension = (file.originalname.split('.').pop() || '').toLowerCase();
//     const objectName = `condominiums/${condominiumId}/properties/${propertyId}/inspections/${randomUUID()}.${extension}`;

//     const { fileName } = await this.minio.uploadFile(file, this.allowedExtensions, objectName);

//     return this.repo.create({
//       condominiumId,
//       propertyId,
//       objectName: fileName,
//       originalName: file.originalname,
//       mimeType: file.mimetype,
//       extension,
//       size: file.size,
//     });
//   }

//   list(condominiumId: string, propertyId: string) {
//     return this.repo.list(condominiumId, propertyId);
//   }

//   async findOne(condominiumId: string, propertyId: string, inspectionId: string) {
//     const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);
//     const url = await this.minio.getFileUrl(inspection.objectName);
//     return { ...inspection, url };
//   }

//   async getDownloadUrl(condominiumId: string, propertyId: string, inspectionId: string) {
//     const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);
//     const url = await this.minio.getFileUrl(inspection.objectName);
//     return { url };
//   }

//   async remove(condominiumId: string, propertyId: string, inspectionId: string) {
//     const inspection = await this.repo.findOne(condominiumId, propertyId, inspectionId);

//     try {
//       await this.minio.deleteFile(inspection.objectName);
//     } catch {
//     }

//     await this.repo.softDelete(condominiumId, propertyId, inspectionId);
//   }
// }