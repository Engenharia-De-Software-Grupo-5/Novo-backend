import { Test, TestingModule } from '@nestjs/testing';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { PropertyDocumentsController } from 'src/controllers/condominiums/property-documents.controller';
import { PropertyDocumentsService } from 'src/services/condominiums/property-documents.repository';


describe('PropertyDocumentsController', () => {
  let controller: PropertyDocumentsController;
  let service: jest.Mocked<PropertyDocumentsService>;

  const mockService = {
    upload: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    getDownloadUrl: jest.fn(),
    remove: jest.fn(),
  };

  const condoId = 'condo-1';
  const propertyId = 'prop-1';

  const makeFile = (name = 'doc.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyDocumentsController],
      providers: [{ provide: PropertyDocumentsService, useValue: mockService }],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(PropertyDocumentsController);
    service = module.get(PropertyDocumentsService);
  });

  it('upload should call service.upload(condominiumId, propertyId, dto, file)', async () => {
    service.upload.mockResolvedValue({ id: 'd1' } as any);

    const dto: any = { description: 'x' };
    const res = await controller.upload(condoId, propertyId, dto);

    expect(service.upload).toHaveBeenCalledWith(
      condoId,
      propertyId,
      dto
    );
    expect(res).toEqual({ id: 'd1' });
  });

  it('list should call service.list(condominiumId, propertyId)', async () => {
    service.list.mockResolvedValue([{ id: 'd1' }] as any);

    const res = await controller.list(condoId, propertyId);

    expect(service.list).toHaveBeenCalledWith(condoId, propertyId);
    expect(res).toEqual([{ id: 'd1' }]);
  });

  it('findOne should call service.findOne(condominiumId, propertyId, documentId)', async () => {
    service.findOne.mockResolvedValue({ id: 'd1' } as any);

    const res = await controller.findOne(condoId, propertyId, 'd1');

    expect(service.findOne).toHaveBeenCalledWith(condoId, propertyId, 'd1');
    expect(res).toEqual({ id: 'd1' });
  });

  it('download should call service.download(condominiumId, propertyId, documentId)', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'signed' } as any);

    const res = await controller.download(condoId, propertyId, 'd1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith(condoId, propertyId, 'd1');
    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should call service.remove(condominiumId, propertyId, documentId)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove(condoId, propertyId, 'd1');

    expect(service.remove).toHaveBeenCalledWith(condoId, propertyId, 'd1');
    expect(res).toBeUndefined();
  });
});