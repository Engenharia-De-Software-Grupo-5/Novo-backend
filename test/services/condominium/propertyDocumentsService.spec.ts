import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';


import { PropertyDocumentsRepository } from 'src/repositories/condominiums/property-documents.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';

describe('PropertyDocumentsService', () => {
  let service: PropertyDocumentsService;
  let repo: jest.Mocked<PropertyDocumentsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = (): jest.Mocked<PropertyDocumentsRepository> =>
    ({
      assertPropertyOwned: jest.fn(),
      create: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
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
        PropertyDocumentsService,
        { provide: PropertyDocumentsRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(PropertyDocumentsService);
    repo = module.get(PropertyDocumentsRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload document (happy path)', async () => {
    repo.assertPropertyOwned.mockResolvedValue({ id: 'prop-1' } as any);
    minio.uploadFile.mockResolvedValue({ fileName: 'obj' });
    repo.create.mockResolvedValue({ id: 'doc-1' } as any);

    const file = {
      originalname: 'arquivo.pdf',
      mimetype: 'application/pdf',
      size: 999,
      buffer: Buffer.from('x'),
    } as any;

    const res = await service.upload('cond-1', 'prop-1', file);

    expect(repo.assertPropertyOwned).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf'],
      expect.stringMatching(
        /^condominiums\/cond-1\/properties\/prop-1\/documents\/.+\.pdf$/,
      ),
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        condominiumId: 'cond-1',
        propertyId: 'prop-1',
        objectName: 'obj',
        originalName: 'arquivo.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 999,
      }),
    );
    expect(res).toEqual({ id: 'doc-1' });
  });

  it('should propagate NotFoundException from repo on upload when property not owned', async () => {
    repo.assertPropertyOwned.mockRejectedValue(new NotFoundException('Property not found.'));

    const file = {
      originalname: 'arquivo.pdf',
      mimetype: 'application/pdf',
      size: 999,
      buffer: Buffer.from('x'),
    } as any;

    await expect(service.upload('cond-1', 'prop-1', file)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(minio.uploadFile).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should list documents', async () => {
    repo.list.mockResolvedValue([{ id: 'doc-1' }] as any);

    const res = await service.list('cond-1', 'prop-1');

    expect(repo.list).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(res).toEqual([{ id: 'doc-1' }]);
  });

  it('should findOne and append url', async () => {
    repo.findOne.mockResolvedValue({ id: 'doc-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.findOne('cond-1', 'prop-1', 'doc-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(res).toEqual(expect.objectContaining({ id: 'doc-1', url: 'http://url' }));
  });

  it('should get download url', async () => {
    repo.findOne.mockResolvedValue({ id: 'doc-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.getDownloadUrl('cond-1', 'prop-1', 'doc-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(res).toEqual({ url: 'http://url' });
  });

  it('should remove document: delete file best-effort and soft delete record', async () => {
    repo.findOne.mockResolvedValue({ id: 'doc-1', objectName: 'obj' } as any);
    minio.deleteFile.mockResolvedValue(undefined as any);
    repo.softDelete.mockResolvedValue(undefined as any);

    await service.remove('cond-1', 'prop-1', 'doc-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
  });

  it('should remove document even if minio deleteFile fails', async () => {
    repo.findOne.mockResolvedValue({ id: 'doc-1', objectName: 'obj' } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail'));
    repo.softDelete.mockResolvedValue(undefined as any);

    await service.remove('cond-1', 'prop-1', 'doc-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
  });
});