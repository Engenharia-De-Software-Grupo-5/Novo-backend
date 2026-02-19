import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ExpenseInvoiceController } from 'src/controllers/expenses/expense-invoice.controller';
import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

describe('ExpenseInvoiceController', () => {
  let controller: ExpenseInvoiceController;
  let service: jest.Mocked<ExpenseInvoiceService>;

  const mockService = () =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseInvoiceController],
      providers: [{ provide: ExpenseInvoiceService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ExpenseInvoiceController);
    service = module.get(ExpenseInvoiceService);
  });

  it('should upload and call service', async () => {
    service.upload.mockResolvedValue({ id: 'inv-1' } as any);

    const file = {
      originalname: 'nota.pdf',
      mimetype: 'application/pdf',
      size: 100,
      buffer: Buffer.from('x'),
    } as any;

    const res = await controller.upload('exp-1', file);

    expect(service.upload).toHaveBeenCalledWith('exp-1', file);
    expect(res).toEqual({ id: 'inv-1' });
  });

  it('should throw BadRequest when upload has no file', async () => {
    await expect(controller.upload('exp-1', undefined as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list invoices', async () => {
    service.list.mockResolvedValue([{ id: 'inv-1' }] as any);

    const res = await controller.list('exp-1');

    expect(service.list).toHaveBeenCalledWith('exp-1');
    expect(res).toEqual([{ id: 'inv-1' }]);
  });

  it('should find invoice details', async () => {
    service.findOne.mockResolvedValue({ id: 'inv-1', url: 'http://url' } as any);

    const res = await controller.findOne('exp-1', 'inv-1');

    expect(service.findOne).toHaveBeenCalledWith('exp-1', 'inv-1');
    expect(res).toEqual({ id: 'inv-1', url: 'http://url' });
  });

  it('should get download url', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'http://url' } as any);

    const res = await controller.download('exp-1', 'inv-1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('exp-1', 'inv-1');
    expect(res).toEqual({ url: 'http://url' });
  });

  it('should remove (no content)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('exp-1', 'inv-1');

    expect(service.remove).toHaveBeenCalledWith('exp-1', 'inv-1');
    expect(res).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('nf'));

    await expect(controller.list('exp-x')).rejects.toBeInstanceOf(NotFoundException);
  });
});