import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { PdfGenerateDto } from './pdf.dto';

@Injectable()
export class PdfService {
  async generatePdf(body: PdfGenerateDto): Promise<Buffer> {
    const browser = await puppeteer.launch(); // 启动 Puppeteer 浏览器实例
    const page = await browser.newPage(); // 打开一个新页面
    console.log(body.url);
    const cookies = Object.entries(body.cookies).map(([key, value]) => ({
      name: key,
      value,
      domain: new URL(body.url).host,
    }));
    console.log(cookies);
    await page.setCookie(...cookies);
    // 打开需要生成 PDF 的网页，可以是你自己的页面
    await page.goto(body.url || 'http://localhost:3000/pdf-demo.html', {
      waitUntil: 'networkidle2',
    });

    const footerTemplate = `
    <footer  style="width: 100%;margin-bottom: 1cm">
      <table cellspacing="0" cellpadding="0" frame="border" rules="all"
             style="width: auto;font-size: 6pt;font-family: Arial;margin: 0 auto;border-collapse:collapse;color: #666;border-color: #666">
        <tbody>
          <tr>
            <td style="padding: 0 10px;width: 50px;">Report No.:</td>
            <td style="padding: 0 10px;">2</td>
            <td style="padding: 0 10px;width: 50px;">Version:</td>
            <td style="padding: 0 10px;min-width: 60px;">3</td>
            <td style="padding: 0 10px;text-align: center;" rowspan="2">
              Page
              <span class="pageNumber"></span>
              of
              <span class="totalPages"></span>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 10px;width: 50px;">Issue Date:</td>
            <td style="padding: 0 10px;">
             
            </td>
            <td style="padding: 0 10px;width: 50px;">Rev. Date:</td>
            <td style="padding: 0 10px;">
            
            </td>
          </tr>
        </tbody>
      </table>
    </footer>

    `;

    // 生成 PDF，页面尺寸可以根据需求调整
    const pdfBuffer = await page.pdf({
      path: 'report.pdf',
      format: 'A4',
      scale: 1,
      printBackground: true,
      omitBackground: true,
      // landscape:true,//是否横向打印
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      displayHeaderFooter: true,
      // headerTemplate: '<div>1</div>',
      // footerTemplate: '<div>2</div>',
      footerTemplate,
    });

    await browser.close(); // 关闭浏览器实例
    // 将 Uint8Array 转换为 Buffer
    return Buffer.from(pdfBuffer);
  }
}
