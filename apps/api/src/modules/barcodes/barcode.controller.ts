import { Request, Response } from 'express';
import { barcodeService } from './barcode.service';
import { ApiResponse } from '../../core/ApiResponse';
import { AppError } from '../../core/AppError';

export class BarcodeController {
  async getSvg(req: Request, res: Response) {
    const text = req.query.text as string;
    if (!text) {
      throw AppError.badRequest('Query parameter "text" is required');
    }

    const svg = await barcodeService.generateSvg({ text });
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send(svg);
  }

  async getPng(req: Request, res: Response) {
    const text = req.query.text as string;
    if (!text) {
      throw AppError.badRequest('Query parameter "text" is required');
    }

    const png = await barcodeService.generatePng({ text });
    res.setHeader('Content-Type', 'image/png');
    return res.send(png);
  }

  async getProductLabel(req: Request, res: Response) {
    const { sku, barcode, name, sellingPrice, bisCertNumber, ageGroup } = req.query;
    if (!sku || !barcode || !name) {
      throw AppError.badRequest('sku, barcode, and name are required');
    }

    const html = barcodeService.generateProductLabelHtml({
      sku: sku as string,
      barcode: barcode as string,
      name: name as string,
      sellingPrice: parseFloat((sellingPrice as string) || '0'),
      bisCertNumber: (bisCertNumber as string) || 'N/A',
      ageGroup: (ageGroup as string) || 'All Ages',
    });

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  async getLocationLabel(req: Request, res: Response) {
    const { code, barcode, type } = req.query;
    if (!code || !barcode) {
      throw AppError.badRequest('code and barcode are required');
    }

    const html = barcodeService.generateLocationLabelHtml(
      code as string,
      barcode as string,
      (type as string) || 'STORAGE'
    );

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}

export const barcodeController = new BarcodeController();
