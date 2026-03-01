import { ExpenseService } from 'src/services/expenses/expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let repo: any;
  let minio: any;

  beforeEach(() => {
    repo = { create: jest.fn() };
    minio = {
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    };

    service = new ExpenseService(repo, minio);
  });

  it('create should throw when dto.files is undefined (current behavior)', async () => {
    await expect((service as any).create({} as any, 'c1')).rejects.toBeInstanceOf(
      TypeError,
    );
  });

  it('create should work when dto.files is empty array', async () => {
    repo.create.mockResolvedValue({ id: 'ex1' });

    const dto = { files: [] } as any;

    const res = await (service as any).create(dto, 'c1');

    expect(minio.uploadFile).not.toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 'ex1' });
  });
});