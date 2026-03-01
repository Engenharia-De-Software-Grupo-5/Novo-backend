import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';

import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';


jest.mock('node:crypto', () => ({
  randomUUID: () => 'uuid-fixed',
}));

describe('EmployeeContractsService', () => {
  let service: EmployeeContractsService;
  let repo: jest.Mocked<EmployeeContractsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  const mockRepo = {
    employeeExists: jest.fn(),
    create: jest.fn(),
    listByEmployee: jest.fn(),
    findForEmployee: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockMinio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const makeFile = (name = 'contract.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 1234,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeContractsService,
        { provide: EmployeeContractsRepository, useValue: mockRepo },
        { provide: MinioClientService, useValue: mockMinio },
      ],
    }).compile();

    service = module.get(EmployeeContractsService);
    repo = module.get(EmployeeContractsRepository);
    minio = module.get(MinioClientService);

    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should throw NotFoundException when employee does not exist', async () => {
      repo.employeeExists.mockResolvedValue(null);

      await expect(service.upload('e1', makeFile())).rejects.toThrow(
        NotFoundException,
      );

      expect(minio.uploadFile).not.toHaveBeenCalled();
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should throw UnsupportedMediaTypeException when extension is not pdf', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);

      await expect(service.upload('e1', makeFile('x.png'))).rejects.toThrow(
        UnsupportedMediaTypeException,
      );

      expect(minio.uploadFile).not.toHaveBeenCalled();
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should upload to minio and create record', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);
      minio.uploadFile.mockResolvedValue({ fileName: 'minio-file.pdf' } as any);

      repo.create.mockResolvedValue({ id: 'c1' } as any);

      const res = await service.upload('e1', makeFile('my.pdf'));

      expect(minio.uploadFile).toHaveBeenCalledTimes(1);
      const [fileArg, allowed, objectName] = minio.uploadFile.mock.calls[0];
      expect(fileArg.originalname).toBe('my.pdf');
      expect(allowed).toEqual(['pdf']);
      expect(objectName).toBe('employees/e1/contracts/uuid-fixed.pdf');

      expect(repo.create).toHaveBeenCalledWith({
        employeeId: 'e1',
        objectName: 'minio-file.pdf',
        originalName: 'my.pdf',
        mimeType: 'application/pdf',
        extension: 'pdf',
        size: 1234,
      });

      expect(res).toEqual({ id: 'c1' });
    });
  });

  describe('list', () => {
    it('should throw when employee does not exist', async () => {
      repo.employeeExists.mockResolvedValue(null);

      await expect(service.list('e1')).rejects.toThrow(NotFoundException);
      expect(repo.listByEmployee).not.toHaveBeenCalled();
    });

    it('should list contracts', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);
      repo.listByEmployee.mockResolvedValue([{ id: 'c1' }] as any);

      const res = await service.list('e1');

      expect(repo.listByEmployee).toHaveBeenCalledWith('e1');
      expect(res).toEqual([{ id: 'c1' }]);
    });
  });

  describe('findOne', () => {
    it('should throw when contract not found', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(service.findOne('e1', 'c1')).rejects.toThrow(
        NotFoundException,
      );

      expect(minio.getFileUrl).not.toHaveBeenCalled();
    });

    it('should return contract with url', async () => {
      repo.findForEmployee.mockResolvedValue({
        id: 'c1',
        objectName: 'obj.pdf',
      } as any);

      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.findOne('e1', 'c1');

      expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
      expect(res).toMatchObject({ id: 'c1', objectName: 'obj.pdf', url: 'signed-url' });
    });
  });

  describe('getDownloadUrl', () => {
    it('should throw when contract not found', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(service.getDownloadUrl('e1', 'c1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return url only', async () => {
      repo.findForEmployee.mockResolvedValue({ objectName: 'obj.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.getDownloadUrl('e1', 'c1');

      expect(res).toEqual({ url: 'signed-url' });
    });
  });

  describe('remove', () => {
    it('should throw when contract not found', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(service.remove('e1', 'c1')).rejects.toThrow(
        NotFoundException,
      );

      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    it('should delete file (ignore errors) and soft delete', async () => {
      repo.findForEmployee.mockResolvedValue({ objectName: 'obj.pdf' } as any);
      minio.deleteFile.mockRejectedValue(new Error('minio down'));

      await service.remove('e1', 'c1');

      expect(minio.deleteFile).toHaveBeenCalledWith('obj.pdf');
      expect(repo.softDelete).toHaveBeenCalledWith('c1');
    });
  });
});