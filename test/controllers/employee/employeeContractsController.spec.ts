import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { EmployeeContractsController } from 'src/controllers/employees/employee-contracts.controller';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';

describe('EmployeeContractsController', () => {
  let controller: EmployeeContractsController;
  let service: jest.Mocked<EmployeeContractsService>;

  const mockService = (): jest.Mocked<EmployeeContractsService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeContractsController],
      providers: [{ provide: EmployeeContractsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeeContractsController);
    service = module.get(EmployeeContractsService);
  });

  it('should upload contract and call service', async () => {
    const employeeId = 'emp-1';
    const file = {
      originalname: 'contrato.pdf',
      mimetype: 'application/pdf',
      size: 123,
      buffer: Buffer.from('x'),
    } as any;

    const created = { id: 'ctr-1' };
    service.upload.mockResolvedValue(created as any);

    const result = await controller.upload(employeeId, file);

    expect(service.upload).toHaveBeenCalledWith(employeeId, file);
    expect(result).toEqual(created);
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload('emp-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list employee contracts', async () => {
    const employeeId = 'emp-1';
    const list = [{ id: 'ctr-1' }, { id: 'ctr-2' }];
    service.list.mockResolvedValue(list as any);

    const result = await controller.list(employeeId);

    expect(service.list).toHaveBeenCalledWith(employeeId);
    expect(result).toEqual(list);
  });

  it('should findOne employee contract', async () => {
    const employeeId = 'emp-1';
    const contractId = 'ctr-1';
    const detail = { id: contractId, url: 'http://x' };
    service.findOne.mockResolvedValue(detail as any);

    const result = await controller.findOne(employeeId, contractId);

    expect(service.findOne).toHaveBeenCalledWith(employeeId, contractId);
    expect(result).toEqual(detail);
  });

  it('should get download url', async () => {
    const employeeId = 'emp-1';
    const contractId = 'ctr-1';
    const payload = { url: 'http://download' };
    service.getDownloadUrl.mockResolvedValue(payload as any);

    const result = await controller.download(employeeId, contractId);

    expect(service.getDownloadUrl).toHaveBeenCalledWith(employeeId, contractId);
    expect(result).toEqual(payload);
  });

  it('should remove contract (no content)', async () => {
    const employeeId = 'emp-1';
    const contractId = 'ctr-1';

    service.remove.mockResolvedValue(undefined as any);

    const result = await controller.remove(employeeId, contractId);

    expect(service.remove).toHaveBeenCalledWith(employeeId, contractId);
    expect(result).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.list('emp-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should propagate UnsupportedMediaTypeException', async () => {
    service.upload.mockRejectedValue(new UnsupportedMediaTypeException('PDF only'));

    await expect(controller.upload('emp-1', {} as any)).rejects.toBeInstanceOf(
      UnsupportedMediaTypeException,
    );
  });
});