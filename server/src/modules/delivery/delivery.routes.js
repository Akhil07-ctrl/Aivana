import express from 'express';
import { 
  calculateShippingRates, 
  createShipment, 
  trackShipment 
} from './delivery.controller.js';
import { validateApiKey } from '../../middleware/apiKey.middleware.js';

const router = express.Router();

// For calculating checkout rates
router.post('/rates', calculateShippingRates);

// For management to fulfill orders
router.post('/shipment', validateApiKey, createShipment);

// For users to track their orders
router.get('/track/:awb', trackShipment);

export default router;
