import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('EmployeeContractsService', () => {
  let service: EmployeeContractsService;
  let repo: jest.Mocked<EmployeeContractsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = (): jest.Mocked<EmployeeContractsRepository> =>
    ({
      employeeExists: jest.fn(),
      create: jest.fn(),
      listByEmployee: jest.fn(),
      findForEmployee: jest.fn(),
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
        EmployeeContractsService,
        { provide: EmployeeContractsRepository, useFactory: mockRepo },
        { provide: MinioClientService, useFactory: mockMinio },
      ],
    }).compile();

    service = module.get(EmployeeContractsService);
    repo = module.get(EmployeeContractsRepository);
    minio = module.get(MinioClientService);
  });

  it('should upload PDF contract for employee', async () => {
    (randomUUID as jest.Mock).mockReturnValue('uuid-1');

    const employeeId = 'emp-1';
    const file = {
      originalname: 'contrato.pdf',
      mimetype: 'application/pdf',
      size: 1000,
      buffer: Buffer.from('x'),
    } as any;

    repo.employeeExists.mockResolvedValue({ id: employeeId } as any);
    minio.uploadFile.mockResolvedValue({
      fileName: `employees/${employeeId}/contracts/uuid-1.pdf`,
    });
    repo.create.mockResolvedValue({ id: 'ctr-1' } as any);

    const result = await service.upload(employeeId, file);

    expect(repo.employeeExists).toHaveBeenCalledWith(employeeId);

    expect(minio.uploadFile).toHaveBeenCalledWith(
      file,
      ['pdf'],
      `employees/${employeeId}/contracts/uuid-1.pdf`,
    );

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeId,
        objectName: `employees/${employeeId}/contracts/uuid-1.pdf`,
        originalName: 'contrato.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 1000,
      }),
    );

    expect(result).toEqual({ id: 'ctr-1' });
  });

  it('should throw NotFoundException when employee not found on upload', async () => {
    repo.employeeExists.mockResolvedValue(null as any);

    await expect(
      service.upload('emp-x', { originalname: 'contrato.pdf' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw UnsupportedMediaTypeException when not PDF', async () => {
    repo.employeeExists.mockResolvedValue({ id: 'emp-1' } as any);

    const file = { originalname: 'contrato.png', mimetype: 'image/png' } as any;

    await expect(service.upload('emp-1', file)).rejects.toBeInstanceOf(
      UnsupportedMediaTypeException,
    );

    expect(minio.uploadFile).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should list contracts (and validate employee exists)', async () => {
    repo.employeeExists.mockResolvedValue({ id: 'emp-1' } as any);
    repo.listByEmployee.mockResolvedValue([{ id: 'ctr-1' }] as any);

    const result = await service.list('emp-1');

    expect(repo.employeeExists).toHaveBeenCalledWith('emp-1');
    expect(repo.listByEmployee).toHaveBeenCalledWith('emp-1');
    expect(result).toEqual([{ id: 'ctr-1' }]);
  });

  it('should throw NotFoundException on list when employee not found', async () => {
    repo.employeeExists.mockResolvedValue(null as any);

    await expect(service.list('emp-x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should findOne and include url', async () => {
    repo.findForEmployee.mockResolvedValue({
      id: 'ctr-1',
      objectName: 'obj',
    } as any);
    minio.getFileUrl.mockResolvedValue('http://url');

    const result = await service.findOne('emp-1', 'ctr-1');

    expect(repo.findForEmployee).toHaveBeenCalledWith('emp-1', 'ctr-1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj');
    expect(result).toEqual({ id: 'ctr-1', objectName: 'obj', url: 'http://url' });
  });

  it('should throw NotFoundException on findOne when contract not found', async () => {
    repo.findForEmployee.mockResolvedValue(null as any);

    await expect(service.findOne('emp-1', 'ctr-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should get download url', async () => {
    repo.findForEmployee.mockResolvedValue({
      id: 'ctr-1',
      objectName: 'obj',
    } as any);
    minio.getFileUrl.mockResolvedValue('http://download');

    const result = await service.getDownloadUrl('emp-1', 'ctr-1');

    expect(result).toEqual({ url: 'http://download' });
  });

  it('should throw NotFoundException on getDownloadUrl when contract not found', async () => {
    repo.findForEmployee.mockResolvedValue(null as any);

    await expect(service.getDownloadUrl('emp-1', 'ctr-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should remove contract: delete file best-effort and soft delete record', async () => {
    repo.findForEmployee.mockResolvedValue({
      id: 'ctr-1',
      objectName: 'obj',
    } as any);
    minio.deleteFile.mockResolvedValue(undefined);
    repo.softDelete.mockResolvedValue({ id: 'ctr-1' } as any);

    const result = await service.remove('emp-1', 'ctr-1');

    expect(minio.deleteFile).toHaveBeenCalledWith('obj');
    expect(repo.softDelete).toHaveBeenCalledWith('ctr-1');
    expect(result).toBeUndefined(); 
  });

  it('should remove contract even if minio deleteFile fails', async () => {
    repo.findForEmployee.mockResolvedValue({
      id: 'ctr-1',
      objectName: 'obj',
    } as any);
    minio.deleteFile.mockRejectedValue(new Error('fail'));
    repo.softDelete.mockResolvedValue({ id: 'ctr-1' } as any);

    const result = await service.remove('emp-1', 'ctr-1');

    expect(repo.softDelete).toHaveBeenCalledWith('ctr-1');
    expect(result).toBeUndefined();
  });

  it('should throw NotFoundException on remove when contract not found', async () => {
    repo.findForEmployee.mockResolvedValue(null as any);

    await expect(service.remove('emp-1', 'ctr-x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});