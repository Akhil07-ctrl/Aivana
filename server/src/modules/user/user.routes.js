import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// TODO: Implement user profile, address, wishlist routes
router.get('/profile', protect, (req, res) => res.json({ user: req.user }));

export default router;
