import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { InvoiceRepository } from 'src/repositories/invoices/invoice.repository';
import { CondominiumInvoiceService } from 'src/services/invoices/condominium.invoice.service';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('CondominiumInvoiceService', () => {
  let service: CondominiumInvoiceService;
  let repo: jest.Mocked<InvoiceRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = (): jest.Mocked<InvoiceRepository> =>
    ({
      condominiumExists: jest.fn(),
      create: jest.fn(),
      listByCondominium: jest.fn(),
      findForCondominium: jest.fn(),
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
        CondominiumInvoiceService,
        { provide: InvoiceRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(CondominiumInvoiceService);
    repo = module.get(InvoiceRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload invoice for condominium', async () => {
    (randomUUID as jest.Mock).mockReturnValue('uuid-1');

    const condominiumId = 'cond-1';
    const file = {
      originalname: 'nota.pdf',
      mimetype: 'application/pdf',
      size: 1000,
      buffer: Buffer.from('x'),
    } as any;

    repo.condominiumExists.mockResolvedValue({ id: condominiumId } as any);
    minio.uploadFile.mockResolvedValue({
      fileName: `condominiums/${condominiumId}/invoices/uuid-1.pdf`,
    });
    repo.create.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.upload(condominiumId, file);

    expect(repo.condominiumExists).toHaveBeenCalledWith(condominiumId);

    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf'],
      `condominiums/${condominiumId}/invoices/uuid-1.pdf`,
    );

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: 'CONDOMINIUM',
        condominiumId,
        propertyId: null,
        objectName: `condominiums/${condominiumId}/invoices/uuid-1.pdf`,
        originalName: 'nota.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 1000,
      }),
    );

    expect(result).toEqual({ id: 'inv-1' });
  });

  it('should throw NotFoundException when condominium not found on upload', async () => {
    repo.condominiumExists.mockResolvedValue(null as any);

    await expect(
      service.upload('cond-x', { originalname: 'x.pdf' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should list invoices', async () => {
    repo.listByCondominium.mockResolvedValue([{ id: 'inv-1' }] as any);

    const result = await service.list('cond-1');

    expect(repo.listByCondominium).toHaveBeenCalledWith('cond-1');
    expect(result).toEqual([{ id: 'inv-1' }]);
  });

  it('should findOne and include url', async () => {
    repo.findForCondominium.mockResolvedValue({
      id: 'inv-1',
      objectName: 'obj',
    } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const result = await service.findOne('cond-1', 'inv-1');

    expect(repo.findForCondominium).toHaveBeenCalledWith('cond-1', 'inv-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(result).toEqual({ id: 'inv-1', objectName: 'obj', url: 'http://url' });
  });

  it('should throw NotFoundException on findOne when invoice not found', async () => {
    repo.findForCondominium.mockResolvedValue(null as any);

    await expect(service.findOne('cond-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should get download url', async () => {
    repo.findForCondominium.mockResolvedValue({
      id: 'inv-1',
      objectName: 'obj',
    } as any);
    minio.getFileUrl.mockResolvedValue('http://download');

    const result = await service.getDownloadUrl('cond-1', 'inv-1');

    expect(result).toEqual({ url: 'http://download' });
  });

  it('should throw NotFoundException on getDownloadUrl when invoice not found', async () => {
    repo.findForCondominium.mockResolvedValue(null as any);

    await expect(service.getDownloadUrl('cond-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should remove invoice: delete file best-effort and soft delete record', async () => {
    repo.findForCondominium.mockResolvedValue({
      id: 'inv-1',
      objectName: 'obj',
    } as any);
    minio.deleteFile.mockResolvedValue(undefined);
    repo.softDelete.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.remove('cond-1', 'inv-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('inv-1');
    expect(result).toEqual({ message: 'Invoice removed' });
  });

  it('should remove invoice even if minio deleteFile fails', async () => {
    repo.findForCondominium.mockResolvedValue({
      id: 'inv-1',
      objectName: 'obj',
    } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail'));
    repo.softDelete.mockResolvedValue({ id: 'inv-1' } as any);

    const result = await service.remove('cond-1', 'inv-1');

    expect(repo.softDelete).toHaveBeenCalledWith('inv-1');
    expect(result).toEqual({ message: 'Invoice removed' });
  });

  it('should throw NotFoundException on remove when invoice not found', async () => {
    repo.findForCondominium.mockResolvedValue(null as any);

    await expect(service.remove('cond-1', 'inv-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});