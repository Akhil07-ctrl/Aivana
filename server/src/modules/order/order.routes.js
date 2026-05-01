import express from 'express';
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderAsDelivered
} from './order.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateApiKey } from '../../middleware/apiKey.middleware.js';

const router = express.Router();

router.use(protect); // All order routes require auth

router.get('/', validateApiKey, getAllOrders);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/verify-payment', verifyPayment);
router.patch('/:id/mark-delivered', validateApiKey, markOrderAsDelivered);

export default router;
