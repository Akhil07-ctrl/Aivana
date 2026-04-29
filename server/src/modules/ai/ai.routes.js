import express from 'express';
import { getFashionAdvice, getRecommendations } from './ai.controller.js';

const router = express.Router();

router.post('/chat', getFashionAdvice);
router.get('/recommend', getRecommendations);

export default router;
