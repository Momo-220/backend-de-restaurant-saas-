import { Module } from '@nestjs/common';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { FilesService } from './files.service';

@Module({
  controllers: [QrCodeController, PdfController],
  providers: [QrCodeService, PdfService, FilesService],
  exports: [QrCodeService, PdfService, FilesService],
})
export class FilesModule {}
