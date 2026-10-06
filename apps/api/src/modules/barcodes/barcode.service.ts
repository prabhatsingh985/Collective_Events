import bwipjs from 'bwip-js';

export interface BarcodeRenderOptions {
  text: string;
  bcid?: string; // default: 'code128'
  scale?: number; // 1 to 5
  height?: number; // height in mm
  includeText?: boolean;
  textxalign?: 'center' | 'left' | 'right';
}

export class BarcodeService {
  /**
   * Generates a Code128 SVG string
   */
  async generateSvg(options: BarcodeRenderOptions): Promise<string> {
    const png = await this.generatePng(options);
    const base64 = png.toString('base64');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <image href="data:image/png;base64,${base64}" width="300" height="100"/>
</svg>`;
  }

  /**
   * Generates a Code128 PNG Buffer
   */
  async generatePng(options: BarcodeRenderOptions): Promise<Buffer> {
    const png = await bwipjs.toBuffer({
      bcid: options.bcid || 'code128',
      text: options.text,
      scale: options.scale || 3,
      height: options.height || 12,
      includetext: options.includeText !== false,
      textxalign: options.textxalign || 'center',
    });
    return png;
  }

  /**
   * Generates printable thermal SVG label (4x6 or custom shelf bin tag)
   */
  generateLocationLabelHtml(locationCode: string, barcodeValue: string, type: string): string {
    return `
      <div style="width: 300px; padding: 16px; border: 2px dashed #000; font-family: sans-serif; text-align: center; background: #fff;">
        <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #555;">TOY DC LOCATION BIN</div>
        <div style="font-size: 26px; font-weight: 900; margin: 8px 0; color: #111;">${locationCode}</div>
        <div style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; background: #eee; border-radius: 4px; margin-bottom: 8px;">TYPE: ${type}</div>
        <div style="margin-top: 6px;">
          <img src="/api/v1/barcodes/png?text=${encodeURIComponent(barcodeValue)}" style="max-width: 100%; height: auto;" alt="${barcodeValue}" />
        </div>
        <div style="font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-top: 4px;">*${barcodeValue}*</div>
      </div>
    `;
  }

  generateProductLabelHtml(product: {
    sku: string;
    barcode: string;
    name: string;
    sellingPrice: number;
    bisCertNumber: string;
    ageGroup: string;
  }): string {
    return `
      <div style="width: 320px; padding: 14px; border: 2px solid #222; font-family: sans-serif; background: #fff;">
        <div style="font-size: 13px; font-weight: bold; color: #000; line-height: 1.2; margin-bottom: 4px;">${product.name}</div>
        <div style="font-size: 11px; color: #444; margin-bottom: 6px;">SKU: <b>${product.sku}</b> | MRP: <b>₹${product.sellingPrice.toFixed(2)}</b></div>
        <div style="font-size: 10px; color: #555; margin-bottom: 8px;">Age: <b>${product.ageGroup}</b> | BIS CM/L: <b>${product.bisCertNumber}</b></div>
        <div style="text-align: center; margin-top: 6px;">
          <img src="/api/v1/barcodes/png?text=${encodeURIComponent(product.barcode)}" style="max-width: 100%; height: auto;" alt="${product.barcode}" />
          <div style="font-size: 11px; font-weight: bold; margin-top: 2px;">${product.barcode}</div>
        </div>
      </div>
    `;
  }
}

export const barcodeService = new BarcodeService();
