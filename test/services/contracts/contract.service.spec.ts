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
    getPaginated: jest.fn(),
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

  it('getAll should call repo.getAll(condominiumId)', async () => {
    repo.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await service.getAll('cond1');

    expect(repo.getAll).toHaveBeenCalledWith('cond1');
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should replace contractUrl with temp url', async () => {
    repo.getById.mockResolvedValue({ id: 'c1', contractUrl: 'obj.pdf' } as any);
    minio.getFileUrl.mockResolvedValue('signed-url');

    const res = await service.getById('cond1', 'c1');

    expect(repo.getById).toHaveBeenCalledWith('cond1', 'c1');
    expect(minio.getFileUrl).toHaveBeenCalledWith('obj.pdf');
    expect(res.contractUrl).toBe('signed-url');
  });

  describe('create', () => {
    it('should throw when contract already exists', async () => {
      repo.checkIfHas.mockResolvedValue({ id: 'exists' } as any);

      await expect(service.create('cond1', { tenantId: 't1', propertyId: 'p1' } as any, makeFile()))
        .rejects.toThrow(BadRequestException);

      expect(repo.create).not.toHaveBeenCalled();
    });

    it('should create using template (contractTemplateId), generate pdf and update url', async () => {
      repo.checkIfHas.mockResolvedValue(null);

      repo.create.mockResolvedValue({ id: 'ct1' } as any);
      generator.execute.mockResolvedValue({ url: 'minio.pdf' } as any);
      repo.updateUrl.mockResolvedValue({ id: 'ct1', contractUrl: 'minio.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.create(
        'cond1',
        { contractTemplateId: 't1', content: 'manual', tenantId: 't1', propertyId: 'p1' } as any,
        undefined,
      );

      // OBS: o código atual chama generator.execute(response.id, dto.content)
      expect(generator.execute).toHaveBeenCalledWith('ct1', 'manual');
      expect(repo.updateUrl).toHaveBeenCalledWith('cond1', 'ct1', 'minio.pdf');
      expect(res.contractUrl).toBe('signed-url');
    });

    it('should create by uploading file when no templateId', async () => {
      repo.checkIfHas.mockResolvedValue(null);

      repo.create.mockResolvedValue({ id: 'ct1' } as any);
      minio.uploadFile.mockResolvedValue({ fileName: 'uploaded.pdf' } as any);
      repo.updateUrl.mockResolvedValue({ id: 'ct1', contractUrl: 'uploaded.pdf' } as any);
      minio.getFileUrl.mockResolvedValue('signed-url');

      const res = await service.create(
        'cond1',
        { tenantId: 't1', propertyId: 'p1' } as any,
        makeFile(),
      );

      expect(minio.uploadFile).toHaveBeenCalledTimes(1);
      expect(repo.updateUrl).toHaveBeenCalledWith('cond1', 'ct1', 'uploaded.pdf');
      expect(res.contractUrl).toBe('signed-url');
    });
  });

  it('update should call repo.update(condominiumId, id, dto)', async () => {
    repo.update.mockResolvedValue({ id: 'ct1' } as any);

    const res = await service.update('cond1', 'ct1', {} as any);

    expect(repo.update).toHaveBeenCalledWith('cond1', 'ct1', {});
    expect(res).toEqual({ id: 'ct1' });
  });

  it('delete should call repo.delete(condominiumId, id)', async () => {
    repo.delete.mockResolvedValue({ id: 'ct1' } as any);

    const res = await service.delete('cond1', 'ct1');

    expect(repo.delete).toHaveBeenCalledWith('cond1', 'ct1');
    expect(res).toEqual({ id: 'ct1' });
  });

  it('listByTenant should call repo.listByTenant(condominiumId, tenantId)', async () => {
    repo.listByTenant.mockResolvedValue([{ id: 'ct1' }] as any);

    const res = await service.listByTenant('cond1', 't1');

    expect(repo.listByTenant).toHaveBeenCalledWith('cond1', 't1');
    expect(res).toEqual([{ id: 'ct1' }]);
  });

  it('listByProperty should call repo.listByProperty(condominiumId, propertyId)', async () => {
    repo.listByProperty.mockResolvedValue([{ id: 'ct1' }] as any);

    const res = await service.listByProperty('cond1', 'p1');

    expect(repo.listByProperty).toHaveBeenCalledWith('cond1', 'p1');
    expect(res).toEqual([{ id: 'ct1' }]);
  });
});