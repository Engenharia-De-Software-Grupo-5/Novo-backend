import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';
import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

describe('PropertyInspectionsService', () => {
  let service: PropertyInspectionsService;
  let repo: jest.Mocked<PropertyInspectionsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = (): jest.Mocked<PropertyInspectionsRepository> =>
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
        PropertyInspectionsService,
        { provide: PropertyInspectionsRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(PropertyInspectionsService);
    repo = module.get(PropertyInspectionsRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload inspection (happy path)', async () => {
    repo.assertPropertyOwned.mockResolvedValue({ id: 'prop-1' } as any);
    minio.uploadFile.mockResolvedValue({ fileName: 'obj' });
    repo.create.mockResolvedValue({ id: 'ins-1' } as any);

    const file = {
      originalname: 'foto.png',
      mimetype: 'image/png',
      size: 123,
      buffer: Buffer.from('x'),
    } as any;

    const res = await service.upload('cond-1', 'prop-1', file);

    expect(repo.assertPropertyOwned).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf'],
      expect.stringMatching(
        /^condominiums\/cond-1\/properties\/prop-1\/inspections\/.+\.png$/,
      ),
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        condominiumId: 'cond-1',
        propertyId: 'prop-1',
        objectName: 'obj',
        originalName: 'foto.png',
        mimeType: 'image/png',
        extension: 'png',
        size: 123,
      }),
    );
    expect(res).toEqual({ id: 'ins-1' });
  });

  it('should propagate NotFoundException from repo on upload when property not owned', async () => {
    repo.assertPropertyOwned.mockRejectedValue(new NotFoundException('Property not found.'));

    const file = {
      originalname: 'foto.png',
      mimetype: 'image/png',
      size: 123,
      buffer: Buffer.from('x'),
    } as any;

    await expect(service.upload('cond-1', 'prop-1', file)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(minio.uploadFile).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should list inspections', async () => {
    repo.list.mockResolvedValue([{ id: 'ins-1' }] as any);

    const res = await service.list('cond-1', 'prop-1');

    expect(repo.list).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(res).toEqual([{ id: 'ins-1' }]);
  });

  it('should findOne and append url', async () => {
    repo.findOne.mockResolvedValue({ id: 'ins-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.findOne('cond-1', 'prop-1', 'ins-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(res).toEqual(expect.objectContaining({ id: 'ins-1', url: 'http://url' }));
  });

  it('should get download url', async () => {
    repo.findOne.mockResolvedValue({ id: 'ins-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.getDownloadUrl('cond-1', 'prop-1', 'ins-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(res).toEqual({ url: 'http://url' });
  });

  it('should remove inspection: delete file best-effort and soft delete record', async () => {
    repo.findOne.mockResolvedValue({ id: 'ins-1', objectName: 'obj' } as any);
    minio.deleteFile.mockResolvedValue(undefined as any);
    repo.softDelete.mockResolvedValue(undefined as any);

    await service.remove('cond-1', 'prop-1', 'ins-1');

    expect(repo.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
  });

  it('should remove inspection even if minio deleteFile fails', async () => {
    repo.findOne.mockResolvedValue({ id: 'ins-1', objectName: 'obj' } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail'));
    repo.softDelete.mockResolvedValue(undefined as any);

    await service.remove('cond-1', 'prop-1', 'ins-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('cond-1', 'prop-1', 'ins-1');
  });
});