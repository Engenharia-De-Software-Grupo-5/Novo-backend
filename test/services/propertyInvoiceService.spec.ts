import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { PropertyInvoiceService } from 'src/services/invoices/property.invoice.service';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('PropertyInvoiceService', () => {
  let service: PropertyInvoiceService;
  let repo: jest.Mocked<InvoiceRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = (): jest.Mocked<InvoiceRepository> =>
    ({
      propertyExists: jest.fn(),
      create: jest.fn(),
      listByProperty: jest.fn(),
      findForProperty: jest.fn(),
      softDelete: jest.fn(),
    }) as any;

  const mockMinio = (): jest.Mocked<MinioClientService> =>
    ({
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyInvoiceService,
        { provide: InvoiceRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(PropertyInvoiceService);
    repo = module.get(InvoiceRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload invoice for property', async () => {
    (randomUUID as jest.Mock).mockReturnValue('uuid-1');

    const propertyId = 'prop-1';
    const file = {
      originalname: 'nota.jpeg',
      mimetype: 'image/jpeg',
      size: 222,
      buffer: Buffer.from('x'),
    } as any;

    repo.propertyExists.mockResolvedValue({ id: propertyId } as any);
    minio.uploadFile.mockResolvedValue({
      fileName: `properties/${propertyId}/invoices/uuid-1.jpeg`,
    });
    repo.create.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.upload(propertyId, file);

    expect(repo.propertyExists).toHaveBeenCalledWith(propertyId);
    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf'],
      `properties/${propertyId}/invoices/uuid-1.jpeg`,
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: 'PROPERTY',
        propertyId,
        condominiumId: null,
        objectName: `properties/${propertyId}/invoices/uuid-1.jpeg`,
        originalName: 'nota.jpeg',
        mimeType: 'image/jpeg',
        extension: 'jpeg',
        size: 222,
      }),
    );
    expect(result).toEqual({ id: 'inv-1' });
  });

  it('should throw NotFoundException when property not found on upload', async () => {
    repo.propertyExists.mockResolvedValue(null as any);

    await expect(
      service.upload('prop-x', { originalname: 'x.pdf' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should list invoices', async () => {
    repo.listByProperty.mockResolvedValue([{ id: 'inv-1' }] as any);

    const result = await service.list('prop-1');

    expect(repo.listByProperty).toHaveBeenCalledWith('prop-1');
    expect(result).toEqual([{ id: 'inv-1' }]);
  });

  it('should findOne and include url', async () => {
    repo.findForProperty.mockResolvedValue({ id: 'inv-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const result = await service.findOne('prop-1', 'inv-1');

    expect(repo.findForProperty).toHaveBeenCalledWith('prop-1', 'inv-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(result).toEqual({ id: 'inv-1', objectName: 'obj', url: 'http://url' });
  });

  it('should throw NotFoundException on findOne when invoice not found', async () => {
    repo.findForProperty.mockResolvedValue(null as any);

    await expect(service.findOne('prop-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should get download url', async () => {
    repo.findForProperty.mockResolvedValue({ id: 'inv-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://download');

    const result = await service.getDownloadUrl('prop-1', 'inv-1');

    expect(result).toEqual({ url: 'http://download' });
  });

  it('should throw NotFoundException on getDownloadUrl when invoice not found', async () => {
    repo.findForProperty.mockResolvedValue(null as any);

    await expect(service.getDownloadUrl('prop-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should remove invoice: delete file best-effort and soft delete record', async () => {
    repo.findForProperty.mockResolvedValue({ id: 'inv-1', objectName: 'obj' } as any);
    minio.deleteFile.mockResolvedValue(undefined);
    repo.softDelete.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.remove('prop-1', 'inv-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('inv-1');
    expect(result).toEqual({ message: 'Invoice removed' });
  });

  it('should remove invoice even if minio deleteFile fails', async () => {
    repo.findForProperty.mockResolvedValue({ id: 'inv-1', objectName: 'obj' } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail'));
    repo.softDelete.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.remove('prop-1', 'inv-1');

    expect(repo.softDelete).toHaveBeenCalledWith('inv-1');
    expect(result).toEqual({ message: 'Invoice removed' });
  });

  it('should throw NotFoundException on remove when invoice not found', async () => {
    repo.findForProperty.mockResolvedValue(null as any);

    await expect(service.remove('prop-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});