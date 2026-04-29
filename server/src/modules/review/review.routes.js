import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// TODO: Reviews for products
router.get('/:productId', (req, res) => res.json({ reviews: [] }));

export default router;
