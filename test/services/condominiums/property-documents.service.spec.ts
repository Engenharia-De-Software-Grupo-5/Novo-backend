import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'uuid'),
}));

describe('PropertyDocumentsService', () => {
  const repo = {
    assertPropertyOwned: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  const minio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const makeFile = (name = 'doc.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upload should assert ownership, upload to minio and create record', async () => {
    const service = new PropertyDocumentsService(repo as any, minio as any);

    repo.assertPropertyOwned.mockResolvedValue(undefined as any);
    minio.uploadFile.mockResolvedValue({ fileName: 'obj.pdf' });
    repo.create.mockResolvedValue({ id: 'd1' });

    const res = await service.upload('condo1', 'prop1', makeFile('a.PDF'));

    expect(repo.assertPropertyOwned).toHaveBeenCalledWith('condo1', 'prop1');
    expect(minio.uploadFile).toHaveBeenCalledWith(
      expect.any(Object),
      ['jpg', 'jpeg', 'png', 'pdf'],
      expect.stringContaining('condominiums/condo1/properties/prop1/documents/uuid.pdf'),
    );
    expect(repo.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 'd1' });
  });

  it('list should call repo.list(condominiumId, propertyId)', async () => {
    const service = new PropertyDocumentsService(repo as any, minio as any);

    repo.list.mockResolvedValue([{ id: 'd1' }]);

    const res = await service.list('condo1', 'prop1');

    expect(repo.list).toHaveBeenCalledWith('condo1', 'prop1');
    expect(res).toEqual([{ id: 'd1' }]);
  });

  it('findOne should return doc + url', async () => {
    const service = new PropertyDocumentsService(repo as any, minio as any);

    repo.findOne.mockResolvedValue({ id: 'd1', objectName: 'obj.pdf' });
    minio.getFileUrl.mockResolvedValue('signed');

    const res = await service.findOne('condo1', 'prop1', 'd1');

    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res).toEqual({ id: 'd1', objectName: 'obj.pdf', url: 'signed' });
  });

  it('getDownloadUrl should return { url }', async () => {
    const service = new PropertyDocumentsService(repo as any, minio as any);

    repo.findOne.mockResolvedValue({ id: 'd1', objectName: 'obj.pdf' });
    minio.getFileUrl.mockResolvedValue('signed');

    const res = await service.getDownloadUrl('condo1', 'prop1', 'd1');

    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should try delete in minio and softDelete in repo', async () => {
    const service = new PropertyDocumentsService(repo as any, minio as any);

    repo.findOne.mockResolvedValue({ id: 'd1', objectName: 'obj.pdf' });
    minio.deleteFile.mockRejectedValue(new Error('ignore'));
    repo.softDelete.mockResolvedValue(undefined as any);

    const res = await service.remove('condo1', 'prop1', 'd1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
    expect(repo.softDelete).toHaveBeenCalledWith('condo1', 'prop1', 'd1');
    expect(res).toBeUndefined();
  });
});