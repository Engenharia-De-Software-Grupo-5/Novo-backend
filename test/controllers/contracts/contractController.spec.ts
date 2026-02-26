import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ContractsController } from 'src/controllers/contracts/contract.controller';
import { ContractsService } from 'src/services/contracts/contract.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: jest.Mocked<ContractsService>;

  const mockService = (): jest.Mocked<ContractsService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),

      linkLease: jest.fn(),
      unlinkLease: jest.fn(),
      listByTenant: jest.fn(),
      listByProperty: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [{ provide: ContractsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ContractsController);
    service = module.get(ContractsService);
  });

  it('should upload contract and call service', async () => {
    service.upload.mockResolvedValue({ id: 'c-1' } as any);

    const file = {
      originalname: 'contrato.pdf',
      mimetype: 'application/pdf',
      size: 1,
      buffer: Buffer.from('x'),
    } as any;

    const res = await controller.upload(file);

    expect(service.upload).toHaveBeenCalledWith(file);
    expect(res).toEqual({ id: 'c-1' });
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload()).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list contracts (no filter)', async () => {
    service.list.mockResolvedValue([{ id: 'c-1' }] as any);

    const res = await controller.list();

    expect(service.list).toHaveBeenCalledWith(undefined);
    expect(res).toEqual([{ id: 'c-1' }]);
  });

  it('should list contracts (tenantCpf filter)', async () => {
    service.list.mockResolvedValue([{ id: 'c-2' }] as any);

    const res = await controller.list('11111111111');

    expect(service.list).toHaveBeenCalledWith('11111111111');
    expect(res).toEqual([{ id: 'c-2' }]);
  });

  it('should find contract details', async () => {
    service.findOne.mockResolvedValue({ id: 'c-1', url: 'http://x' } as any);

    const res = await controller.findOne('c-1' as any);

    expect(service.findOne).toHaveBeenCalledWith('c-1');
    expect(res).toEqual({ id: 'c-1', url: 'http://x' });
  });

  it('should get download url', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'http://x' } as any);

    const res = await controller.download('c-1' as any);

    expect(service.getDownloadUrl).toHaveBeenCalledWith('c-1');
    expect(res).toEqual({ url: 'http://x' });
  });

  it('should remove contract (no content)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('c-1' as any);

    expect(service.remove).toHaveBeenCalledWith('c-1');
    expect(res).toBeUndefined();
  });

  it('should link/unlink lease (ternary relation)', async () => {
    service.linkLease.mockResolvedValue({ id: 'lease-1' } as any);

    const linkRes = await controller.linkLease(
      'c-1' as any,
      't-1' as any,
      'p-1' as any,
    );

    // service.linkLease(contractId, propertyId, tenantId)
    expect(service.linkLease).toHaveBeenCalledWith('c-1', 'p-1', 't-1');
    expect(linkRes).toEqual({ id: 'lease-1' });

    service.unlinkLease.mockResolvedValue(undefined as any);

    const unlinkRes = await controller.unlinkLease(
      'c-1' as any,
      't-1' as any,
      'p-1' as any,
    );

    expect(service.unlinkLease).toHaveBeenCalledWith('c-1', 'p-1', 't-1');
    expect(unlinkRes).toBeUndefined();
  });

  it('should listByTenant / listByProperty', async () => {
    service.listByTenant.mockResolvedValue([{ id: 'c-1' }] as any);
    service.listByProperty.mockResolvedValue([{ id: 'c-2' }] as any);

    const byTenant = await controller.listByTenant('t-1' as any);
    const byProp = await controller.listByProperty('p-1' as any);

    expect(service.listByTenant).toHaveBeenCalledWith('t-1');
    expect(service.listByProperty).toHaveBeenCalledWith('p-1');

    expect(byTenant).toEqual([{ id: 'c-1' }]);
    expect(byProp).toEqual([{ id: 'c-2' }]);
  });

  it('should propagate NotFoundException', async () => {
    service.findOne.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.findOne('x' as any)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});