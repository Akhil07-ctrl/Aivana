import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
} from './review.controller.js';

const router = express.Router();

// Public routes
router.get('/:productId', getProductReviews);
router.post('/:reviewId/helpful', markHelpful);

// Protected routes (requires authentication)
router.use(protect);

router.get('/user/myreviews', getMyReviews);
router.post('/:productId', createReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;
