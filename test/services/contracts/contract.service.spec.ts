import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { ContractService } from 'src/services/contracts/contract.service';
import { MinioClientService } from 'src/services/tools/minio-client.service';
import { GenerateContractService } from 'src/services/tools/generate-contract.service';
import { ContractRepository } from 'src/repositories/contracts/contract.repository';

describe('ContractService', () => {
  let service: ContractService;
  let minio: jest.Mocked<MinioClientService>;
  let generator: jest.Mocked<GenerateContractService>;
  let repo: jest.Mocked<ContractRepository>;

  const mockMinio = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
  };

  const mockGenerator = {
    execute: jest.fn(),
  };

  const mockRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    checkIfHas: jest.fn(),
    create: jest.fn(),
    updateUrl: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    listByTenant: jest.fn(),
    listByProperty: jest.fn(),
  };

  const makeFile = (): Express.Multer.File =>
    ({ originalname: 'x.pdf', mimetype: 'application/pdf', size: 10 } as any);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        { provide: MinioClientService, useValue: mockMinio },
        { provide: GenerateContractService, useValue: mockGenerator },
        { provide: ContractRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(ContractService);
    minio = module.get(MinioClientService);
    generator = module.get(GenerateContractService);
    repo = module.get(ContractRepository);

    jest.clearAllMocks();
  });

  it('getAll should call repo.getAll', async () => {
    repo.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.getAll();

    expect(repo.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should replace contractUrl with temp url', async () => {
    repo.getById.mockResolvedValue({ id: 'c1', contractUrl: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.getById('c1');

    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res.contractUrl).toBe('signed-url');
  });

  describe('create', () => {
    it('should throw when contract already exists', async () => {
      repo.checkIfHas.mockResolvedValue({ id: 'exists' } as any);

      await expect(service.create({} as any, makeFile())).rejects.toThrow(
        BadRequestException,
      );

      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should create using template (contractTemplateId), generate pdf and update url', async () => {
      repo.checkIfHas.mockResolvedValue(null);

      repo.create.mockResolvedValue({ id: 'c1' } as any);
      generator.execute.mockResolvedValue({ url: 'minio.pdf' } as any);
      repo.updateUrl.mockResolvedValue({ id: 'c1', contractUrl: 'minio.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.create(
        { contractTemplateId: 't1', content: 'manual' } as any,
        undefined,
      );

      expect(generator.execute).toHaveBeenCalledWith('c1', 'manual');
      expect(repo.updateUrl).toHaveBeenCalledWith('c1', 'minio.pdf');
      expect(res.contractUrl).toBe('signed-url');
    });

    it('should create by uploading file when no templateId', async () => {
      repo.checkIfHas.mockResolvedValue(null);

      repo.create.mockResolvedValue({ id: 'c1' } as any);
      minio.uploadFile.mockResolvedValue({ fileName: 'uploaded.pdf' } as any);
      repo.updateUrl.mockResolvedValue({ id: 'c1', contractUrl: 'uploaded.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.create({} as any, makeFile());

      expect(minio.uploadFile).toHaveBeenCalledTimes(1);
      expect(repo.updateUrl).toHaveBeenCalledWith('c1', 'uploaded.pdf');
      expect(res.contractUrl).toBe('signed-url');
    });
  });

  it('update should call repo.update', async () => {
    repo.update.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.update('c1', { } as any);

    expect(repo.update).toHaveBeenCalledWith('c1', {});
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should call repo.delete', async () => {
    repo.delete.mockResolvedValue({ id: 'c1' } as any);

    const res = await service.delete('c1');

    expect(repo.delete).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('listByTenant should call repo.listByTenant', async () => {
    repo.listByTenant.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.listByTenant('t1');

    expect(repo.listByTenant).toHaveBeenCalledWith('t1');
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('listByProperty should call repo.listByProperty', async () => {
    repo.listByProperty.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.listByProperty('p1');

    expect(repo.listByProperty).toHaveBeenCalledWith('p1');
    expect(res).toEqual([{ id: 'c1' }]);
  });
});