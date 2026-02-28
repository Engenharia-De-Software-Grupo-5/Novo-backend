import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { EmployeeContractsController } from 'src/controllers/employees/employee-contracts.controller';
import { EmployeeContractsService } from 'src/services/employees/employee-contracts.service';

describe('EmployeeContractsController', () => {
  let controller: EmployeeContractsController;
  let service: jest.Mocked<EmployeeContractsService>;

  const mockService = {
    upload: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    getDownloadUrl: jest.fn(),
    remove: jest.fn(),
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
      controllers: [EmployeeContractsController],
      providers: [{ provide: EmployeeContractsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EmployeeContractsController);
    service = module.get(EmployeeContractsService);
  });

  it('upload should throw BadRequestException when file not provided', async () => {
    await expect(controller.upload('e1', undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('upload should call service.upload(employeeId, file)', async () => {
    service.upload.mockResolvedValue({ id: 'c1' } as any);

    const file = makeFile('x.pdf');
    const res = await controller.upload('e1', file);

    expect(service.upload).toHaveBeenCalledWith('e1', file);
    expect(res).toEqual({ id: 'c1' });
  });

  it('list should call service.list(employeeId)', async () => {
    service.list.mockResolvedValue([{ id: 'c1' }] as any);

    const res = await controller.list('e1');

    expect(service.list).toHaveBeenCalledWith('e1');
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('findOne should call service.findOne(employeeId, contractId)', async () => {
    service.findOne.mockResolvedValue({ id: 'c1' } as any);

    const res = await controller.findOne('e1', 'c1');

    expect(service.findOne).toHaveBeenCalledWith('e1', 'c1');
    expect(res).toEqual({ id: 'c1' });
  });

  it('download should call service.getDownloadUrl(employeeId, contractId)', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'signed' } as any);

    const res = await controller.download('e1', 'c1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('e1', 'c1');
    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should await service.remove(employeeId, contractId) and return void', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('e1', 'c1');

    expect(service.remove).toHaveBeenCalledWith('e1', 'c1');
    expect(res).toBeUndefined();
  });
});