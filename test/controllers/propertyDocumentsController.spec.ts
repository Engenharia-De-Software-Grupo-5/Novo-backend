import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PropertyDocumentsController } from 'src/controllers/condominiums/property-documents.controller';
import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';


describe('PropertyDocumentsController', () => {
  let controller: PropertyDocumentsController;
  let service: jest.Mocked<PropertyDocumentsService>;

  const mockService = (): jest.Mocked<PropertyDocumentsService> =>
    ({
      upload: jest.fn(),
      list: jest.fn(),
      findOne: jest.fn(),
      getDownloadUrl: jest.fn(),
      remove: jest.fn(),
    }) as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyDocumentsController],
      providers: [{ provide: PropertyDocumentsService, useFactory: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyDocumentsController);
    service = module.get(PropertyDocumentsService);
  });

  it('should upload document and call service', async () => {
    service.upload.mockResolvedValue({ id: 'doc-1' } as any);

    const file = {
      originalname: 'arquivo.pdf',
      mimetype: 'application/pdf',
      size: 1,
      buffer: Buffer.from('x'),
    } as any;

    const res = await controller.upload('cond-1', 'prop-1', file);

    expect(service.upload).toHaveBeenCalledWith('cond-1', 'prop-1', file);
    expect(res).toEqual({ id: 'doc-1' });
  });

  it('should throw BadRequestException when upload has no file', async () => {
    await expect(controller.upload('cond-1', 'prop-1', undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should list documents', async () => {
    service.list.mockResolvedValue([{ id: 'doc-1' }] as any);

    const res = await controller.list('cond-1', 'prop-1');

    expect(service.list).toHaveBeenCalledWith('cond-1', 'prop-1');
    expect(res).toEqual([{ id: 'doc-1' }]);
  });

  it('should find document details', async () => {
    service.findOne.mockResolvedValue({ id: 'doc-1', url: 'http://x' } as any);

    const res = await controller.findOne('cond-1', 'prop-1', 'doc-1');

    expect(service.findOne).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(res).toEqual({ id: 'doc-1', url: 'http://x' });
  });

  it('should get download url', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'http://x' } as any);

    const res = await controller.download('cond-1', 'prop-1', 'doc-1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(res).toEqual({ url: 'http://x' });
  });

  it('should remove document (no content)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('cond-1', 'prop-1', 'doc-1');

    expect(service.remove).toHaveBeenCalledWith('cond-1', 'prop-1', 'doc-1');
    expect(res).toBeUndefined();
  });

  it('should propagate NotFoundException', async () => {
    service.list.mockRejectedValue(new NotFoundException('x'));
    await expect(controller.list('cond-1', 'prop-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});