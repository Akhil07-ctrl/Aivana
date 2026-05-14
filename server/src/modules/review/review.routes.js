import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
  addReply,
} from './review.controller.js';

const router = express.Router();

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes (requires authentication)
router.use(protect);

router.get('/user/myreviews', getMyReviews);
router.post('/:productId', createReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/helpful', markHelpful);
router.post('/:reviewId/reply', addReply);

export default router;
