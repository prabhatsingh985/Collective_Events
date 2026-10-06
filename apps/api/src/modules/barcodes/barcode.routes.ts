import { Router } from 'express';
import { barcodeController } from './barcode.controller';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router();

router.get('/svg', asyncHandler(barcodeController.getSvg.bind(barcodeController)));
router.get('/png', asyncHandler(barcodeController.getPng.bind(barcodeController)));
router.get('/product-label', asyncHandler(barcodeController.getProductLabel.bind(barcodeController)));
router.get('/location-label', asyncHandler(barcodeController.getLocationLabel.bind(barcodeController)));

export default router;
