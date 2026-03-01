import { InternalServerErrorException } from '@nestjs/common';

jest.mock('puppeteer', () => ({
  launch: jest.fn(),
}));

describe('PdfGeneratorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a PDF buffer and close browser', async () => {
    const puppeteer = require('puppeteer');

    const pdf = jest.fn().mockResolvedValue(Buffer.from('PDF'));
    const setContent = jest.fn().mockResolvedValue(undefined);

    const newPage = jest.fn().mockResolvedValue({
      setContent,
      pdf,
      close: jest.fn().mockResolvedValue(undefined),
    });

    const closeBrowser = jest.fn().mockResolvedValue(undefined);

    puppeteer.launch.mockResolvedValue({
      newPage,
      close: closeBrowser,
    });

    const { PdfGeneratorService } = require('src/services/tools/pdf-generator.service');
    const service = new PdfGeneratorService();

    const res: Buffer = await service.generate('# Title');

    expect(puppeteer.launch).toHaveBeenCalledTimes(1);
    expect(newPage).toHaveBeenCalledTimes(1);
    expect(setContent).toHaveBeenCalledTimes(1);
    expect(pdf).toHaveBeenCalledTimes(1);

    expect(Buffer.isBuffer(res)).toBe(true);
    expect(res.toString()).toBe('PDF');

    // ✅ o que seu código garante: browser.close no finally
    expect(closeBrowser).toHaveBeenCalledTimes(1);
  });

  it('should throw InternalServerErrorException and still close browser', async () => {
    const puppeteer = require('puppeteer');

    const pdf = jest.fn().mockRejectedValue(new Error('pdf failed'));
    const setContent = jest.fn().mockResolvedValue(undefined);

    const newPage = jest.fn().mockResolvedValue({
      setContent,
      pdf,
      close: jest.fn().mockResolvedValue(undefined),
    });

    const closeBrowser = jest.fn().mockResolvedValue(undefined);

    puppeteer.launch.mockResolvedValue({
      newPage,
      close: closeBrowser,
    });

    const { PdfGeneratorService } = require('src/services/tools/pdf-generator.service');
    const service = new PdfGeneratorService();

    await expect(service.generate('x')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );

    await expect(service.generate('x')).rejects.toThrow(
      'Erro ao gerar PDF do contrato.',
    );

    expect(closeBrowser).toHaveBeenCalledTimes(2);
  });
});