import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ContractTemplateController } from 'src/controllers/contract.templates/contract.template.controller';
import { ContractTemplateService } from 'src/services/contract.templates/contract.template.service';

describe('ContractTemplateController', () => {
  let controller: ContractTemplateController;
  let service: ContractTemplateService;

  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTemplateController],
      providers: [
        {
          provide: ContractTemplateService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContractTemplateController>(ContractTemplateController);
    service = module.get<ContractTemplateService>(ContractTemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('CT-23 - should return all templates without filter', async () => {
      const result = [{ id: '1', name: 'Template 1' }];
      mockService.getAll.mockResolvedValue(result);

      const response = await controller.getAll();

      expect(response).toEqual(result);
      expect(service.getAll).toHaveBeenCalledWith(undefined);
    });

    it('CT-25 - should return filtered templates by name', async () => {
      const result = [{ id: '1', name: 'Template 1' }];
      mockService.getAll.mockResolvedValue(result);

      const response = await controller.getAll('Template');

      expect(response).toEqual(result);
      expect(service.getAll).toHaveBeenCalledWith('Template');
    });
  });

  describe('getById', () => {
    it('CT-24 - should return template by id', async () => {
      const result = { id: '1', name: 'Template 1' };
      mockService.getById.mockResolvedValue(result);

      const response = await controller.getById('1');

      expect(response).toEqual(result);
      expect(service.getById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if template does not exist', async () => {
      mockService.getById.mockRejectedValue(new NotFoundException());

      await expect(controller.getById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('CT-21 - should create a new template', async () => {
      const dto = {
        name: 'Template',
        description: 'Desc',
        template: 'Content {{var}}',
      };

      const result = { id: '1', ...dto };
      mockService.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(response).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('CT-22 - should propagate error on invalid data', async () => {
      mockService.create.mockRejectedValue(new Error('Invalid data'));

      await expect(controller.create({} as any)).rejects.toThrow('Invalid data');
    });
  });

 it('CT-26 - should update contract template with valid dto', async () => {
  const dto = {
    name: 'Updated',
    description: 'Desc',
    template: 'Content {{var}}',
  };

  const result = { id: '1', ...dto };

  mockService.update.mockResolvedValue(result);

  const response = await controller.update('1', dto);

  expect(response).toEqual(result);
  expect(mockService.update).toHaveBeenCalledWith('1', dto);
});

  describe('delete', () => {
    it('CT-27 - should delete template', async () => {
      const result = { id: '1', deletedAt: new Date() };
      mockService.delete.mockResolvedValue(result);

      const response = await controller.delete('1');

      expect(response).toEqual(result);
      expect(service.delete).toHaveBeenCalledWith('1');
    });

    it('CT-28 - should throw NotFoundException if template does not exist', async () => {
      mockService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});