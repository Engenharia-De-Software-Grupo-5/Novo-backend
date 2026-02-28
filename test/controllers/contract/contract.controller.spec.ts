import { Test, TestingModule } from '@nestjs/testing';

import { ContractController } from 'src/controllers/contracts/contract.controller';
import { ContractService } from 'src/services/contracts/contract.service';
import { PreviewContractService } from 'src/services/contracts/preview.contract.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ContractController', () => {
  let controller: ContractController;
  let contractService: jest.Mocked<ContractService>;
  let previewService: jest.Mocked<PreviewContractService>;

  const mockContractService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPreviewService = {
    execute: jest.fn(),
  };

  const makeFile = (name = 'contract.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: PreviewContractService, useValue: mockPreviewService },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ContractController);
    contractService = module.get(ContractService);
    previewService = module.get(PreviewContractService);
  });

  it('getAll should call contractService.getAll()', async () => {
    contractService.getAll.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await controller.getAll();

    expect(contractService.getAll).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('getById should call contractService.getById(id)', async () => {
    contractService.getById.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.getById('c1');

    expect(contractService.getById).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  describe('createWithFile', () => {
    it('should call contractService.create(dto, file) when file provided', async () => {
      contractService.create.mockResolvedValue({ id: 'c1' } as any);

      const dto: any = {
        tenantId: 't1',
        propertyId: 'p1',
        contractTemplateId: 'tpl1',
        description: 'desc',
      };
      const file = makeFile('a.pdf');

      const res = await controller.createWithFile(dto, file);

      expect(contractService.create).toHaveBeenCalledWith(dto, file);
      expect(res).toEqual({ id: 'c1' });
    });

    it('should call contractService.create(dto, undefined) when file not provided', async () => {
      contractService.create.mockResolvedValue({ id: 'c1' } as any);

      const dto: any = {
        tenantId: 't1',
        propertyId: 'p1',
        contractTemplateId: 'tpl1',
      };

      const res = await controller.createWithFile(dto, undefined);

      expect(contractService.create).toHaveBeenCalledWith(dto, undefined);
      expect(res).toEqual({ id: 'c1' });
    });
  });

  it('update should call contractService.update(id, dto)', async () => {
    contractService.update.mockResolvedValue({ id: 'c1' } as any);

    const dto: any = { description: 'new' };

    const res = await controller.update('c1', dto);

    expect(contractService.update).toHaveBeenCalledWith('c1', dto);
    expect(res).toEqual({ id: 'c1' });
  });

  it('delete should call contractService.delete(id)', async () => {
    contractService.delete.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.delete('c1');

    expect(contractService.delete).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('preview should call previewContractService.execute(dto)', async () => {
    previewService.execute.mockResolvedValue({ html: '<h1>ok</h1>' } as any);

    const dto: any = { tenantId: 't1', propertyId: 'p1', contractTemplateId: 'tpl1' };

    const res = await controller.preview(dto);

    expect(previewService.execute).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ html: '<h1>ok</h1>' });
  });
});