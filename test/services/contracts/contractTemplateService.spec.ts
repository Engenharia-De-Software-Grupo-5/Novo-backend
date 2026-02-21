import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { ContractTemplateService } from 'src/services/contract.templates/contract.template.service';
import { ContractTemplateRepository } from 'src/repositories/contract.templates/contract.template.repository';

describe('ContractTemplateService', () => {
  let service: ContractTemplateService;
  let repository: ContractTemplateRepository;

  const mockRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractTemplateService,
        {
          provide: ContractTemplateRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContractTemplateService>(ContractTemplateService);
    repository = module.get<ContractTemplateRepository>(ContractTemplateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('CT-23 - should return all templates', async () => {
      const result = [{ id: '1', name: 'Template' }];
      mockRepository.getAll.mockResolvedValue(result);

      const response = await service.getAll();

      expect(response).toEqual(result);
      expect(repository.getAll).toHaveBeenCalledWith(undefined);
    });

    it('CT-25 - should return filtered templates', async () => {
      const result = [{ id: '1', name: 'Template' }];
      mockRepository.getAll.mockResolvedValue(result);

      const response = await service.getAll('Template');

      expect(response).toEqual(result);
      expect(repository.getAll).toHaveBeenCalledWith('Template');
    });
  });

  describe('getById', () => {
    it('CT-24 - should return template by id', async () => {
      const result = { id: '1', name: 'Template' };
      mockRepository.getById.mockResolvedValue(result);

      const response = await service.getById('1');

      expect(response).toEqual(result);
      expect(repository.getById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if template not found', async () => {
      mockRepository.getById.mockRejectedValue(new NotFoundException());

      await expect(service.getById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('CT-21 - should create template', async () => {
      const dto = {
        name: 'Template',
        description: 'Desc',
        template: 'Content',
      };

      const result = { id: '1', ...dto };

      mockRepository.create.mockResolvedValue(result);

      const response = await service.create(dto);

      expect(response).toEqual(result);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

 it('CT-26 - should update template', async () => {
  const dto = {
    name: 'Updated',
    description: 'Desc',
    template: 'Content {{var}}',
  };

  const result = { id: '1', ...dto };

  mockRepository.update.mockResolvedValue(result);

  const response = await service.update('1', dto);

  expect(response).toEqual(result);
  expect(mockRepository.update).toHaveBeenCalledWith('1', dto);
});

  describe('delete', () => {
    it('CT-27 - should delete template', async () => {
      const result = { id: '1', deletedAt: new Date() };

      mockRepository.delete.mockResolvedValue(result);

      const response = await service.delete('1');

      expect(response).toEqual(result);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('CT-28 - should throw NotFoundException', async () => {
      mockRepository.delete.mockRejectedValue(new NotFoundException());

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});