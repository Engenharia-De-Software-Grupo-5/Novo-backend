import { NotFoundException } from '@nestjs/common';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';

describe('EmployeeContractsService', () => {
  let service: EmployeeContractsService;

  const repo = {
    employeeExists: jest.fn(),
    create: jest.fn(),
    listByEmployee: jest.fn(),
    findForEmployee: jest.fn(),
    softDelete: jest.fn(),
  };

  const minio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    removeFile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmployeeContractsService(repo as any, minio as any);
  });

 it('getDownloadUrl should return signed url (current behavior)', async () => {
  repo.findForEmployee.mockResolvedValue({ name: 'key' } as any);

  minio.getFileUrl.mockResolvedValue({ url: 'signed' } as any);

  const res = await service.getDownloadUrl('c1', 'e1', 'ct1');

  expect(repo.findForEmployee).toHaveBeenCalledWith('c1', 'e1', 'ct1');
  expect(minio.getFileUrl).toHaveBeenCalledWith('key');


  expect(res).toEqual({ url: { url: 'signed' } });
});

  it('list should call repo.listByEmployee (current implementation uses only employeeId)', async () => {
    repo.employeeExists.mockResolvedValue(true);
    repo.listByEmployee.mockResolvedValue([{ id: 'ct1' }]);

    const res = await service.list('c1', 'e1');

    expect(repo.employeeExists).toHaveBeenCalledWith('c1', 'e1');

    expect(repo.listByEmployee).toHaveBeenCalledWith('e1');
    expect(res).toEqual([{ id: 'ct1' }]);
  });

  it('remove should soft delete (current implementation uses only contractId)', async () => {
    repo.softDelete.mockResolvedValue(undefined);

    await service.remove('c1', 'e1', 'ct1');


    expect(repo.softDelete).toHaveBeenCalledWith('ct1');
  });

  it('list should throw when employee does not exist', async () => {
    repo.employeeExists.mockResolvedValue(false);

    await expect(service.list('c1', 'e1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});