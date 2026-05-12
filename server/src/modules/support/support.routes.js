import express from 'express';
import { contactUs } from './support.controller.js';

const router = express.Router();

router.post('/contact', contactUs);

export default router;
