import { Request, Response } from 'express';
import { shippingService } from './shipping.service';
import { ApiResponse } from '../../core/ApiResponse';

export class ShippingController {
  async getShipments(req: Request, res: Response) {
    const shipments = await shippingService.getShipments(req.query.orderId as string);
    return ApiResponse.success(res, shipments, 'Shipments retrieved');
  }

  async getShipmentByAwb(req: Request, res: Response) {
    const shipment = await shippingService.getShipmentByAwb(req.params.awb);
    return ApiResponse.success(res, shipment, 'Shipment details and tracking history retrieved');
  }

  async createShipment(req: Request, res: Response) {
    const shipment = await shippingService.createShipment(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, shipment, 'Shipment created and AWB generated');
  }

  async courierWebhook(req: Request, res: Response) {
    const result = await shippingService.handleCourierWebhook(req.body);
    return ApiResponse.success(res, result, 'Webhook tracking event processed');
  }
}

export const shippingController = new ShippingController();
