import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { PdfGenerateDto } from './pdf.dto';
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generatePdf(
    @Body() body: PdfGenerateDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generatePdf(body);

    // 设置响应头，返回 PDF 文件
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="generated.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer); // 返回生成的 PDF 文件
  }
}
