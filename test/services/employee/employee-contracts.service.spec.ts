import {
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';
import { EmployeeContractsRepository } from 'src/repositories/employees/employee-contracts.repository';
import { MinioClientService } from 'src/services/tools/minio-client.service';

jest.mock('node:crypto', () => ({
  randomUUID: () => 'uuid',
}));

describe('EmployeeContractsService', () => {
  let service: EmployeeContractsService;
  let repo: jest.Mocked<EmployeeContractsRepository>;
  let minio: jest.Mocked<MinioClientService>;

  beforeEach(() => {
    repo = {
      employeeExists: jest.fn(),
      create: jest.fn(),
      listByEmployee: jest.fn(),
      findForEmployee: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    minio = {
      uploadFile: jest.fn(),
      getFileUrl: jest.fn(),
      deleteFile: jest.fn(),
    } as any;

    service = new EmployeeContractsService(repo as any, minio as any);
  });

  describe('upload', () => {
    it('should throw NotFoundException when employee does not exist', async () => {
      repo.employeeExists.mockResolvedValue(null);

      await expect(
        service.upload('c1', 'e1', { originalname: 'x.pdf' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw UnsupportedMediaTypeException when file is not pdf', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);

      await expect(
        service.upload('c1', 'e1', { originalname: 'x.png' } as any),
      ).rejects.toBeInstanceOf(UnsupportedMediaTypeException);
    });

    it('should upload to minio and create contract', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);

      const file = {
        originalname: 'contrato.pdf',
        mimetype: 'application/pdf',
        size: 10,
      } as any;

      minio.uploadFile.mockResolvedValue({ fileName: 'stored.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url' as any);

      repo.create.mockResolvedValue({ id: 'ct1' } as any);

      const res = await service.upload('c1', 'e1', file);

      expect(minio.uploadFile).toHaveBeenCalled();
      expect(minio.getFileUrl).toHaveBeenCalledWith('stored.pdf');

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          condId: 'c1',
          employeeId: 'e1',
          name: 'stored.pdf',
          type: 'application/pdf',
          size: 10,
          url: 'signed-url',
        }),
      );

      expect(res).toEqual({ id: 'ct1' });
    });
  });

  describe('list', () => {
    it('should throw NotFoundException when employee does not exist', async () => {
      repo.employeeExists.mockResolvedValue(null);

      await expect(service.list('c1', 'e1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should call repo.listByEmployee with employeeId', async () => {
      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);
      repo.listByEmployee.mockResolvedValue([{ id: 'ct1' }] as any);

      const res = await service.list('c1', 'e1');

      expect(repo.listByEmployee).toHaveBeenCalledWith('e1');
      expect(res).toEqual([{ id: 'ct1' }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when contract does not exist', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(service.findOne('c1', 'e1', 'ct1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return contract with signed url', async () => {
      repo.findForEmployee.mockResolvedValue({ id: 'ct1', name: 'file.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed' as any);

      const res = await service.findOne('c1', 'e1', 'ct1');

      expect(minio.getFileUrl).toHaveBeenCalledWith('file.pdf');
      expect(res).toEqual({ id: 'ct1', name: 'file.pdf', url: 'signed' });
    });
  });

  describe('getDownloadUrl', () => {
    it('should throw NotFoundException when contract does not exist', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(
        service.getDownloadUrl('c1', 'e1', 'ct1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return { url } using contract.name', async () => {
      repo.findForEmployee.mockResolvedValue({ id: 'ct1', name: 'key' } as any);
      minio.getFileUrl.mockResolvedValue('signed' as any);

      const res = await service.getDownloadUrl('c1', 'e1', 'ct1');

      expect(repo.findForEmployee).toHaveBeenCalledWith('c1', 'e1', 'ct1');
      expect(minio.getFileUrl).toHaveBeenCalledWith('key');
      expect(res).toEqual({ url: 'signed' });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when contract does not exist', async () => {
      repo.findForEmployee.mockResolvedValue(null);

      await expect(service.remove('c1', 'e1', 'ct1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should try to delete file and softDelete by contractId only (current code)', async () => {
      repo.findForEmployee.mockResolvedValue({ id: 'ct1', name: 'file.pdf' } as any);
      minio.deleteFile.mockResolvedValue(undefined);
      repo.softDelete.mockResolvedValue(undefined);

      await service.remove('c1', 'e1', 'ct1');

      expect(minio.deleteFile).toHaveBeenCalledWith('file.pdf');
      expect(repo.softDelete).toHaveBeenCalledWith('ct1');
    });

    it('should still softDelete even if minio.deleteFile throws', async () => {
      repo.findForEmployee.mockResolvedValue({ id: 'ct1', name: 'file.pdf' } as any);
      minio.deleteFile.mockRejectedValue(new Error('minio down'));
      repo.softDelete.mockResolvedValue(undefined);

      await service.remove('c1', 'e1', 'ct1');

      expect(repo.softDelete).toHaveBeenCalledWith('ct1');
    });
  });

  describe('updateEmployeeContracts', () => {
    it('should remove contracts not in existingIds, upload new files, and keep the rest', async () => {
   
      repo.listByEmployee.mockResolvedValue([
        { id: 'old1', name: 'old1.pdf', condId: 'c1', employeeId: 'e1', type: 'application/pdf', size: 1 },
        { id: 'keep1', name: 'keep1.pdf', condId: 'c1', employeeId: 'e1', type: 'application/pdf', size: 1 },
      ] as any);

   
      minio.deleteFile.mockResolvedValue(undefined);
      repo.softDelete.mockResolvedValue(undefined);


      repo.employeeExists.mockResolvedValue({ id: 'e1' } as any);
      minio.uploadFile.mockResolvedValue({ fileName: 'newStored.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed' as any);
      repo.create.mockResolvedValue({
        id: 'new1',
        condId: 'c1',
        employeeId: 'e1',
        name: 'newStored.pdf',
        type: 'application/pdf',
        size: 10,
      } as any);

      const files = [
        { originalname: 'new.pdf', mimetype: 'application/pdf', size: 10 } as any,
      ];

      const result = await service.updateEmployeeContracts('c1', 'e1', files, ['keep1']);

     
      const resolved = await Promise.all(result.map((x: any) => Promise.resolve(x)));


      expect(minio.deleteFile).toHaveBeenCalledWith('old1.pdf');
      expect(repo.softDelete).toHaveBeenCalledWith('old1');


      expect(repo.create).toHaveBeenCalled();

   
      expect(resolved.some((x: any) => x.name === 'keep1.pdf')).toBe(true);
      expect(resolved.some((x: any) => x.name === 'newStored.pdf')).toBe(true);
    });
  });
});