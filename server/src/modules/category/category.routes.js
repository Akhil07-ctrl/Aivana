import express from 'express';
import { getCategories, createCategory } from './category.controller.js';
import { validateApiKey } from '../../middleware/apiKey.middleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', validateApiKey, createCategory);

export default router;
