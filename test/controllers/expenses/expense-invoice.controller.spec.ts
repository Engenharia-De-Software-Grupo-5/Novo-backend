import { Test, TestingModule } from '@nestjs/testing';

import { ExpenseInvoiceController } from 'src/controllers/expenses/expense-invoice.controller';
import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

describe('ExpenseInvoiceController', () => {
  let controller: ExpenseInvoiceController;
  let service: jest.Mocked<ExpenseInvoiceService>;

  const mockService = {
    upload: jest.fn(),
    list: jest.fn(),
    findOne: jest.fn(),
    getDownloadUrl: jest.fn(),
    remove: jest.fn(),
  };

  const makeFile = (name = 'invoice.pdf'): Express.Multer.File =>
    ({
      originalname: name,
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
    } as any);

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseInvoiceController],
      providers: [{ provide: ExpenseInvoiceService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ExpenseInvoiceController);
    service = module.get(ExpenseInvoiceService);
  });

  it('upload should call service.upload(expenseId, file)', async () => {
    service.upload.mockResolvedValue({ id: 'i1' } as any);

    const res = await controller.upload('e1', makeFile('x.png'));

    expect(service.upload).toHaveBeenCalledWith('e1', expect.any(Object));
    expect(res).toEqual({ id: 'i1' });
  });

  it('list should call service.list(expenseId)', async () => {
    service.list.mockResolvedValue([{ id: 'i1' }] as any);

    const res = await controller.list('e1');

    expect(service.list).toHaveBeenCalledWith('e1');
    expect(res).toEqual([{ id: 'i1' }]);
  });

  it('findOne should call service.findOne(expenseId, invoiceId)', async () => {
    service.findOne.mockResolvedValue({ id: 'i1' } as any);

    const res = await controller.findOne('e1', 'i1');

    expect(service.findOne).toHaveBeenCalledWith('e1', 'i1');
    expect(res).toEqual({ id: 'i1' });
  });

  it('download should call service.download(expenseId, invoiceId)', async () => {
    service.getDownloadUrl.mockResolvedValue({ url: 'signed' } as any);

    const res = await controller.download('e1', 'i1');

    expect(service.getDownloadUrl).toHaveBeenCalledWith('e1', 'i1');
    expect(res).toEqual({ url: 'signed' });
  });

  it('remove should call service.remove(expenseId, invoiceId)', async () => {
    service.remove.mockResolvedValue(undefined as any);

    const res = await controller.remove('e1', 'i1');

    expect(service.remove).toHaveBeenCalledWith('e1', 'i1');
    expect(res).toBeUndefined();
  });
});