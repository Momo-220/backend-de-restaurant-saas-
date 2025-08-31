import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { UserRole } from '../common/types/user.types';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly filesService: FilesService,
  ) {}

  @Post('receipt/order/:orderId')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  async generateOrderReceipt(
    @Param('orderId') orderId: string,
    @CurrentTenant() tenant: any,
  ) {
    const pdfUrl = await this.pdfService.generateOrderReceipt(orderId, tenant.id);
    
    return {
      order_id: orderId,
      pdf_url: pdfUrl,
      public_url: this.filesService.getPublicUrl(pdfUrl),
      download_url: `/api/v1/pdf/download/${pdfUrl.split('/').pop()}`,
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getPdfStats(@CurrentTenant() tenant: any) {
    return this.pdfService.getPdfStats(tenant.id);
  }

  @Public()
  @Get('download/:filename')
  async downloadPdf(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Sécurité: vérifier que le fichier est bien un PDF
    if (!filename.match(/^[a-zA-Z0-9_-]+\.pdf$/)) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const relativePath = `/public/receipts/${filename}`;
    const buffer = await this.filesService.getFileBuffer(relativePath);
    
    if (!buffer) {
      return res.status(404).json({ message: 'PDF non trouvé' });
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600', // 1h cache
    });

    return res.send(buffer);
  }

  @Public()
  @Get('view/:filename')
  async viewPdf(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Sécurité: vérifier que le fichier est bien un PDF
    if (!filename.match(/^[a-zA-Z0-9_-]+\.pdf$/)) {
      throw new BadRequestException('Nom de fichier invalide');
    }

    const relativePath = `/public/receipts/${filename}`;
    const buffer = await this.filesService.getFileBuffer(relativePath);
    
    if (!buffer) {
      return res.status(404).json({ message: 'PDF non trouvé' });
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600', // 1h cache
    });

    return res.send(buffer);
  }
}












