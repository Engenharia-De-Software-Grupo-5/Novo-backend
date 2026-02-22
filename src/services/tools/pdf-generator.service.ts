import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as marked from 'marked';

@Injectable()
export class PdfGeneratorService {
    public async generate(markdownContent: string): Promise<Buffer> {
        let browser: puppeteer.Browser | null = null;

        try {
            const htmlContent = marked.parse(markdownContent)

            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });

            const page = await browser.newPage();

            const fullHtml = this.buildHtmlDocument(htmlContent);

            await page.setContent(fullHtml, {
                waitUntil: 'networkidle0',
            });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm',
                },
            });

            return Buffer.from(pdfBuffer);
        } catch (error) {
            throw new InternalServerErrorException(
                'Erro ao gerar PDF do contrato.',
            );
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    private buildHtmlDocument(content: string): string {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              line-height: 1.6;
              color: #000;
            }

            h1, h2, h3 {
              text-align: center;
              margin-bottom: 20px;
            }

            .section {
              margin-bottom: 15px;
            }

            .row {
              display: flex;
              align-items: center;
              margin-bottom: 6px;
            }

            .label {
              white-space: nowrap;
              margin-right: 8px;
            }

            .underline {
              flex: 1;
              border-bottom: 1px solid #000;
              height: 14px;
            }

            .divider {
              border-top: 1px solid #000;
              margin: 10px 0;
            }

            .bold {
              font-weight: bold;
            }

            .center {
              text-align: center;
            }

            footer {
              margin-top: 30px;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
    }
}