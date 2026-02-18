import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';


import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CondominiumInvoiceController } from 'src/controllers/invoices/condominium.invoice.controller';
import { CondominiumInvoiceService } from 'src/services/invoices/condominium.invoice.service';

describe('CondominiumInvoiceController', () => {
  let controller: CondominiumInvoiceController;
  let service: jest.Mocked<CondominiumInvoiceService>;

  const mockService = (): jest.Mocked<CondominiumInvoiceService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondominiumInvoiceController],
      providers: [{ provide: CondominiumInvoiceService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(CondominiumInvoiceController);
    service = module.get(CondominiumInvoiceService);
  });

  it('should upload invoice and call service', async () => {
    const condominiumId = 'cond-1';
    const file = {
      originalname: 'nota.pdf',
      mimetype: 'application/pdf',
      size: 123,
      buffer: Buffer.from('x'),
    } as any;

    const created = { id: 'inv-1' };
    service.upload.mockResolvedValue(created as any);

    const result = await controller.upload(condominiumId, file);

    expect(service.upload).toHaveBeenCalledWith(condominiumId, file);
    expect(result).toEqual(created);
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload('cond-1', undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list invoices', async () => {
    const condominiumId = 'cond-1';
    const list = [{ id: 'inv-1' }, { id: 'inv-2' }];
    service.list.mockResolvedValue(list as any);

    const result = await controller.list(condominiumId);

    expect(service.list).toHaveBeenCalledWith(condominiumId);
    expect(result).toEqual(list);
  });

  it('should find invoice details', async () => {
    const condominiumId = 'cond-1';
    const invoiceId = 'inv-1';
    const detail = { id: invoiceId, url: 'http://x' };
    service.findOne.mockResolvedValue(detail as any);

    const result = await controller.findOne(condominiumId, invoiceId);

    expect(service.findOne).toHaveBeenCalledWith(condominiumId, invoiceId);
    expect(result).toEqual(detail);
  });

  it('should get download url', async () => {
    const condominiumId = 'cond-1';
    const invoiceId = 'inv-1';
    const payload = { url: 'http://download' };
    service.getDownloadUrl.mockResolvedValue(payload as any);

    const result = await controller.download(condominiumId, invoiceId);

    expect(service.getDownloadUrl).toHaveBeenCalledWith(condominiumId, invoiceId);
    expect(result).toEqual(payload);
  });

  it('should remove invoice (no content)', async () => {
    const condominiumId = 'cond-1';
    const invoiceId = 'inv-1';

    service.remove.mockResolvedValue({ message: 'Invoice removed' } as any);

    const result = await controller.remove(condominiumId, invoiceId);

    expect(service.remove).toHaveBeenCalledWith(condominiumId, invoiceId);
    expect(result).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.list('cond-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});