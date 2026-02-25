import { Test, TestingModule } from '@nestjs/testing';

import { PropertyInspectionsService } from 'src/services/condominiums/property-inspections.service';
import { PropertyInspectionsRepository } from 'src/repositories/condominiums/property-inspections.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

jest.mock('node:crypto', () => ({
  randomUUID: () => 'uuid-fixed',
}));

describe('PropertyInspectionsService', () => {
  let service: PropertyInspectionsService;
  let repo: jest.Mocked<PropertyInspectionsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = {
    assertPropertyOwned: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockMinio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const makeFile = (name = 'inspection.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 123,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyInspectionsService,
        { provide: PropertyInspectionsRepository, useValue: mockRepo },
        { provide: MinioClientService, useValue: mockMinio },
      ],
    }).compile();

    service = module.get(PropertyInspectionsService);
    repo = module.get(PropertyInspectionsRepository);
    minio = module.get(MinioClientService);

    jest.clearAllMocks();
  });

  it('upload should assert property ownership, upload file and create record', async () => {
    repo.assertPropertyOwned.mockResolvedValue(undefined as any);
    minio.uploadFile.mockResolvedValue({ fileName: 'obj.pdf' } as any);
    repo.create.mockResolvedValue({ id: 'i1' } as any);

    const res = await service.upload('c1', 'p1', makeFile('photo.jpg'));

    expect(repo.assertPropertyOwned).toHaveBeenCalledWith('c1', 'p1');

    expect(minio.uploadFile).toHaveBeenCalledTimes(1);
    const [fileArg, allowed, objectName] = minio.uploadFile.mock.calls[0];
    expect(fileArg.originalname).toBe('photo.jpg');
    expect(allowed).toEqual(['jpg', 'jpeg', 'png', 'pdf']);
    expect(objectName).toBe(
      'condominiums/c1/properties/p1/inspections/uuid-fixed.jpg',
    );

    expect(repo.create).toHaveBeenCalledWith({
      condominiumId: 'c1',
      propertyId: 'p1',
      objectName: 'obj.pdf',
      originalName: 'photo.jpg',
      mimeType: 'application/pdf',
      extension: 'jpg',
      size: 123,
    });

    expect(res).toEqual({ id: 'i1' });
  });

  it('list should call repo.list(condominiumId, propertyId)', async () => {
    repo.list.mockResolvedValue([{ id: 'i1' }] as any);

    const res = await service.list('c1', 'p1');

    expect(repo.list).toHaveBeenCalledWith('c1', 'p1');
    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('findOne should return inspection with url', async () => {
    repo.findOne.mockResolvedValue({ id: 'i1', objectName: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.findOne('c1', 'p1', 'i1');

    expect(repo.findOne).toHaveBeenCalledWith('c1', 'p1', 'i1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res).toMatchObject({ id: 'i1', objectName: 'obj.pdf', url: 'signed-url' });
  });

  it('getDownloadUrl should return url only', async () => {
    repo.findOne.mockResolvedValue({ id: 'i1', objectName: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.getDownloadUrl('c1', 'p1', 'i1');

    expect(res).toEqual({ url: 'signed-url' });
  });

  it('remove should delete file (ignore errors) then soft delete', async () => {
    repo.findOne.mockResolvedValue({ id: 'i1', objectName: 'obj.pdf' } as any);
    minio.deleteFile.mockRejectedValue(new Error('minio down'));

    await service.remove('c1', 'p1', 'i1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
    expect(repo.softDelete).toHaveBeenCalledWith('c1', 'p1', 'i1');
  });
});