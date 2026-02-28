// import {
//   BadRequestException,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { ExpenseInvoiceService } from 'src/services/expenses/expense-invoice.service';

// @ApiTags('Expense Invoices')
// @ApiBearerAuth('access-token')
// @Controller('expenses/:expenseId/invoices')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class ExpenseInvoiceController {
//   constructor(private readonly service: ExpenseInvoiceService) {}

//   @Post()
//   @ApiConsumes('multipart/form-data')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Upload invoice for expense' })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       required: ['file'],
//       properties: {
//         file: { type: 'string', format: 'binary' },
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file'))
//   async upload(
//     @Param('expenseId') expenseId: string,
//     @UploadedFile() files?: Express.Multer.File[],
//   ) {
//     if (files == null) throw new BadRequestException('Envie um arquivo no campo "file".');
//     return this.service.upload(expenseId, file);
//   }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'List invoices of expense' })
//   list(@Param('expenseId') expenseId: string) {
//     return this.service.list(expenseId);
//   }

//   @Get(':invoiceId')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Get invoice details' })
//   findOne(
//     @Param('expenseId') expenseId: string,
//     @Param('invoiceId') invoiceId: string,
//   ) {
//     return this.service.findOne(expenseId, invoiceId);
//   }

//   @Get(':invoiceId/download')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Get download URL for invoice' })
//   download(
//     @Param('expenseId') expenseId: string,
//     @Param('invoiceId') invoiceId: string,
//   ) {
//     return this.service.getDownloadUrl(expenseId, invoiceId);
//   }

//   @Delete(':invoiceId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Delete invoice (soft delete)' })
//   async remove(
//     @Param('expenseId') expenseId: string,
//     @Param('invoiceId') invoiceId: string,
//   ) {
//     await this.service.remove(expenseId, invoiceId);
//   }
// }