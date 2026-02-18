import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
    

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PropertyInvoiceController } from 'src/controllers/invoices/property.invoice.controller';
import { PropertyInvoiceService } from 'src/services/invoices/property.invoice.service';

describe('PropertyInvoiceController', () => {
  let controller: PropertyInvoiceController;
  let service: jest.Mocked<PropertyInvoiceService>;

  const mockService = (): jest.Mocked<PropertyInvoiceService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyInvoiceController],
      providers: [{ provide: PropertyInvoiceService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyInvoiceController);
    service = module.get(PropertyInvoiceService);
  });

  it('should upload invoice and call service', async () => {
    const propertyId = 'prop-1';
    const file = {
      originalname: 'nota.jpeg',
      mimetype: 'image/jpeg',
      size: 999,
      buffer: Buffer.from('x'),
    } as any;

    const created = { id: 'inv-1' };
    service.upload.mockResolvedValue(created as any);

    const result = await controller.upload(propertyId, file);

    expect(service.upload).toHaveBeenCalledWith(propertyId, file);
    expect(result).toEqual(created);
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload('prop-1', undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list invoices', async () => {
    const propertyId = 'prop-1';
    const list = [{ id: 'inv-1' }, { id: 'inv-2' }];
    service.list.mockResolvedValue(list as any);

    const result = await controller.list(propertyId);

    expect(service.list).toHaveBeenCalledWith(propertyId);
    expect(result).toEqual(list);
  });

  it('should find invoice details', async () => {
    const propertyId = 'prop-1';
    const invoiceId = 'inv-1';
    const detail = { id: invoiceId, url: 'http://x' };
    service.findOne.mockResolvedValue(detail as any);

    const result = await controller.findOne(propertyId, invoiceId);

    expect(service.findOne).toHaveBeenCalledWith(propertyId, invoiceId);
    expect(result).toEqual(detail);
  });

  it('should get download url', async () => {
    const propertyId = 'prop-1';
    const invoiceId = 'inv-1';
    const payload = { url: 'http://download' };
    service.getDownloadUrl.mockResolvedValue(payload as any);

    const result = await controller.download(propertyId, invoiceId);

    expect(service.getDownloadUrl).toHaveBeenCalledWith(propertyId, invoiceId);
    expect(result).toEqual(payload);
  });

  it('should remove invoice (no content)', async () => {
    const propertyId = 'prop-1';
    const invoiceId = 'inv-1';

    service.remove.mockResolvedValue({ message: 'Invoice removed' } as any);

    const result = await controller.remove(propertyId, invoiceId);

    expect(service.remove).toHaveBeenCalledWith(propertyId, invoiceId);
    expect(result).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.list('prop-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});