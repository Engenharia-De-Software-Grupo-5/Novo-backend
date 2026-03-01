import { ExpenseService } from 'src/services/expenses/expense.service';
import { ExpenseRepository } from 'src/repositories/expenses/expense.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { NotFoundException } from '@nestjs/common';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repo: jest.Mocked<ExpenseRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'];

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      getAll: jest.fn(),
      getPaginated: jest.fn(),
      findByIdOrThrow: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    minio = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      getFileUrl: jest.fn(),
    } as any;

    service = new ExpenseService(repo as any, minio as any);
  });

  it('create should upload files and call repo.create(dto, fileUrls)', async () => {
    const files = [
      { originalname: 'a.pdf' } as any,
      { originalname: 'b.pdf' } as any,
    ];

    minio.uploadFile
      .mockResolvedValueOnce({ fileName: 'k1' } as any)
      .mockResolvedValueOnce({ fileName: 'k2' } as any);

    repo.create.mockResolvedValue({ id: 'ex1' } as any);

    const dto = {
      files,
      description: 'd',
      value: 10,
      expenseType: 'X',
      expenseDate: new Date(),
      paymentMethod: 'PIX',
      targetType: 'CONDOMINIUM',
      condominiumId: 'c1',
    } as any;

    const res = await service.create(dto, 'c1');

    expect(minio.uploadFile).toHaveBeenCalledTimes(2);
    expect(minio.uploadFile).toHaveBeenNthCalledWith(
      1,
      files[0],
      allowedExtensions,
      'a.pdf',
    );
    expect(minio.uploadFile).toHaveBeenNthCalledWith(
      2,
      files[1],
      allowedExtensions,
      'b.pdf',
    );


    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        condominiumId: 'c1',
        description: 'd',
        fileNamesList: ['k1', 'k2'],
      }),
      ['k1', 'k2'],
    );

    expect(res).toEqual({ id: 'ex1' });
  });

  it('getAll should call repo.getAll and replace expenseFiles[].link with signed urls', async () => {
    repo.getAll.mockResolvedValue([
      { id: 'ex1', expenseFiles: [{ link: 'k1' }, { link: 'k2' }] },
      { id: 'ex2', expenseFiles: [] },
    ] as any);

    minio.getFileUrl
      .mockResolvedValueOnce('signed-k1' as any)
      .mockResolvedValueOnce('signed-k2' as any);

    const res = await service.getAll();

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(minio.getFileUrl).toHaveBeenCalledWith('k1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('k2');

    expect((res as any)[0].expenseFiles[0].link).toBe('signed-k1');
    expect((res as any)[0].expenseFiles[1].link).toBe('signed-k2');
  });

  it('findOne should call repo.findByIdOrThrow(id) and replace expenseFiles[].link with signed urls', async () => {
    repo.findByIdOrThrow.mockResolvedValue({
      id: 'ex1',
      expenseFiles: [{ link: 'k1' }],
    } as any);

    minio.getFileUrl.mockResolvedValue('signed-k1' as any);

    const res = await service.findOne('ex1');

    expect(repo.findByIdOrThrow).toHaveBeenCalledWith('ex1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('k1');
    expect((res as any).expenseFiles[0].link).toBe('signed-k1');
  });

  it('update should upload dto.files and call repo.update(id, dto, newLinks)', async () => {
    minio.uploadFile
      .mockResolvedValueOnce({ fileName: 'newK1' } as any)
      .mockResolvedValueOnce({ fileName: 'newK2' } as any);

    repo.update.mockResolvedValue({ id: 'ex1' } as any);

    const dto = {
      files: [
        { originalname: 'n1.pdf' } as any,
        { originalname: 'n2.pdf' } as any,
      ],
      description: 'updated',
    } as any;

    const res = await service.update('ex1', dto);

    expect(minio.uploadFile).toHaveBeenCalledTimes(2);
    expect(minio.uploadFile).toHaveBeenNthCalledWith(
      1,
      dto.files[0],
      allowedExtensions,
      'n1.pdf',
    );
    expect(minio.uploadFile).toHaveBeenNthCalledWith(
      2,
      dto.files[1],
      allowedExtensions,
      'n2.pdf',
    );

    
    expect(repo.update).toHaveBeenCalledWith(
      'ex1',
      expect.objectContaining({
        description: 'updated',
      }),
      ['newK1', 'newK2'],
    );

    expect(res).toEqual({ id: 'ex1' });
  });

  it('update should throw NotFoundException when repo.update throws NotFoundException', async () => {
    repo.update.mockRejectedValue(new NotFoundException('Expense not found.'));

    await expect(service.update('ex1', { files: [] } as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove should call repo.softDelete(id) and return its value (current behavior)', async () => {

    repo.softDelete.mockResolvedValue({ message: 'Expense removed successfully.' } as any);

    const res = await service.remove('ex1');

    expect(repo.softDelete).toHaveBeenCalledWith('ex1');
    expect(res).toEqual({ message: 'Expense removed successfully.' });
  });
});