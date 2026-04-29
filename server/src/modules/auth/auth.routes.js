import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  logout,
  getMe,
  googleAuthCallback,
} from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// Email/Password auth
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  googleAuthCallback
);

export default router;
