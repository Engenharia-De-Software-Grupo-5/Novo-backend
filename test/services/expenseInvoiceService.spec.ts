import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';
import { ExpenseInvoiceRepository } from 'src/repositories/expenses/expense-invoice.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

describe('ExpenseInvoiceService', () => {
  let service: ExpenseInvoiceService;
  let repo: jest.Mocked<ExpenseInvoiceRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = () =>
    ({
      create: jest.fn(),
      list: jest.fn(),
      findOneOrThrow: jest.fn(),
      softDelete: jest.fn(),
    }) as any;

  const mockMinio = () =>
    ({
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseInvoiceService,
        { provide: ExpenseInvoiceRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(ExpenseInvoiceService);
    repo = module.get(ExpenseInvoiceRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload: upload to minio then create record', async () => {
    minio.uploadFile.mockResolvedValue({ fileName: 'obj' });
    repo.create.mockResolvedValue({ id: 'inv-1' } as any);

    const file = {
      originalname: 'nota.pdf',
      mimetype: 'application/pdf',
      size: 123,
      buffer: Buffer.from('x'),
    } as any;

    const res = await service.upload('exp-1', file);

    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['jpg', 'jpeg', 'png', 'pdf'],
      expect.stringContaining('expenses/exp-1/invoices/'),
    );

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        expenseId: 'exp-1',
        objectName: 'obj',
        originalName: 'nota.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 123,
      }),
    );

    expect(res).toEqual({ id: 'inv-1' });
  });

  it('should list', async () => {
    repo.list.mockResolvedValue([{ id: 'inv-1' }] as any);
    const res = await service.list('exp-1');
    expect(repo.list).toHaveBeenCalledWith('exp-1');
    expect(res).toEqual([{ id: 'inv-1' }]);
  });

  it('should findOne and append url', async () => {
    repo.findOneOrThrow.mockResolvedValue({ id: 'inv-1', objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.findOne('exp-1', 'inv-1');

    expect(repo.findOneOrThrow).toHaveBeenCalledWith('exp-1', 'inv-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(res).toEqual(expect.objectContaining({ id: 'inv-1', url: 'http://url' }));
  });

  it('should getDownloadUrl', async () => {
    repo.findOneOrThrow.mockResolvedValue({ objectName: 'obj' } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const res = await service.getDownloadUrl('exp-1', 'inv-1');

    expect(res).toEqual({ url: 'http://url' });
  });

  it('should remove: best-effort delete minio then softDelete', async () => {
    repo.findOneOrThrow.mockResolvedValue({ objectName: 'obj' } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail')); // best-effort
    repo.softDelete.mockResolvedValue({ message: 'ok' } as any);

    await service.remove('exp-1', 'inv-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('exp-1', 'inv-1');
  });

  it('should propagate NotFoundException from repo', async () => {
    repo.findOneOrThrow.mockRejectedValue(new NotFoundException('nf'));

    await expect(service.getDownloadUrl('exp-1', 'inv-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});