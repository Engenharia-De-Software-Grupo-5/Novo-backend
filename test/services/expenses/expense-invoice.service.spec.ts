import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

jest.mock('node:crypto', () => ({
  randomUUID: () => 'uuid-fixed',
}));

describe('ExpenseInvoiceService', () => {
  let service: ExpenseInvoiceService;
  let repo: jest.Mocked<ExpenseInvoiceRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = {
    create: jest.fn(),
    list: jest.fn(),
    findOneOrThrow: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockMinio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const makeFile = (name = 'invoice.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 999,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseInvoiceService,
        { provide: ExpenseInvoiceRepository, useValue: mockRepo },
        { provide: MinioClientService, useValue: mockMinio },
      ],
    }).compile();

    service = module.get(ExpenseInvoiceService);
    repo = module.get(ExpenseInvoiceRepository);
    minio = module.get(MinioClientService);

    jest.clearAllMocks();
  });

  it('upload should upload file and create invoice record', async () => {
    minio.uploadFile.mockResolvedValue({ fileName: 'obj.pdf' } as any);
    repo.create.mockResolvedValue({ id: 'inv1' } as any);

    const res = await service.upload('exp1', makeFile('note.png'));

    expect(minio.uploadFile).toHaveBeenCalledTimes(1);
    const [fileArg, allowed, objectName] = minio.uploadFile.mock.calls[0];

    expect(fileArg.originalname).toBe('note.png');
    expect(allowed).toEqual(['jpg', 'jpeg', 'png', 'pdf']);
    expect(objectName).toBe('expenses/exp1/invoices/uuid-fixed.png');

    expect(repo.create).toHaveBeenCalledWith({
      expenseId: 'exp1',
      objectName: 'obj.pdf',
      originalName: 'note.png',
      mimeType: 'application/pdf',
      size: 999,
    });

    expect(res).toEqual({ id: 'inv1' });
  });

  it('list should call repo.list(expenseId)', async () => {
    repo.list.mockResolvedValue([{ id: 'inv1' }] as any);

    const res = await service.list('exp1');

    expect(repo.list).toHaveBeenCalledWith('exp1');
    expect(res).toEqual([{ id: 'inv1' }]);
  });

  it('findOne should return invoice with url', async () => {
    repo.findOneOrThrow.mockResolvedValue({ id: 'inv1', objectName: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.findOne('exp1', 'inv1');

    expect(repo.findOneOrThrow).toHaveBeenCalledWith('exp1', 'inv1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res).toMatchObject({ id: 'inv1', objectName: 'obj.pdf', url: 'signed-url' });
  });

  it('getDownloadUrl should return url only', async () => {
    repo.findOneOrThrow.mockResolvedValue({ id: 'inv1', objectName: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.getDownloadUrl('exp1', 'inv1');

    expect(res).toEqual({ url: 'signed-url' });
  });

  it('remove should delete file (ignore errors) then soft delete', async () => {
    repo.findOneOrThrow.mockResolvedValue({ id: 'inv1', objectName: 'obj.pdf' } as any);
    minio.deleteFile.mockRejectedValue(new Error('minio down'));

    await service.remove('exp1', 'inv1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
    expect(repo.softDelete).toHaveBeenCalledWith('exp1', 'inv1');
  });
});