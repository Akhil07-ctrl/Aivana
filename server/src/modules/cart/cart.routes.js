import express from 'express';
import {
  getMyCart,
  addToCart,
  updateCartItem,
  clearCart,
  syncCart
} from './cart.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Cart is inherently private
router.use(protect);

router.get('/', getMyCart);
router.post('/items', addToCart);
router.put('/items', updateCartItem);
router.delete('/', clearCart);
router.post('/sync', syncCart);

export default router;
