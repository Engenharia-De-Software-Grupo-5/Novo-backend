import { ExpenseService } from 'src/services/expenses/expense.service';

describe('ExpenseService', () => {
  const repo = {
    create: jest.fn(),
  };

  const minio = {
    uploadFile: jest.fn(),
  };

  const service = new ExpenseService(repo as any, minio as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should call repo.create', async () => {
    minio.uploadFile.mockResolvedValue({ fileName: 'f1' });
    repo.create.mockResolvedValue({ id: 'e1' });

    const dto = {
      files: [], 
    } as any;

    const res = await service.create(dto, 'c1');

    expect(repo.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 'e1' });
  });
});