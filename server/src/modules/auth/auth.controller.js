import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import User from '../user/user.model.js';
import { generateAccessToken, setTokenCookie, clearTokenCookie } from '../../utils/generateToken.js';
import { sendEmail, generateWelcomeEmail } from '../../utils/sendEmail.js';

// @desc  Register new user
// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, 'Please provide name, email and password');

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const user = await User.create({ name, email, password });

  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);

  // Send welcome email asynchronously
  sendEmail({
    to: user.email,
    subject: 'Welcome to Aivana! 🎉',
    template: generateWelcomeEmail(user)
  }).catch(e => console.error('[AUTH EMAIL ERROR]', e));

  return res.status(201).json(
    new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }, 'Registered successfully')
  );
});

// @desc  Login user
// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(401, 'Invalid credentials');

  if (!user.isActive)
    throw new ApiError(403, 'Your account has been deactivated');

  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);

  return res.json(
    new ApiResponse(200, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    }, 'Logged in successfully')
  );
});

// @desc  Logout user
// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  return res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json(new ApiResponse(200, user, 'User fetched'));
});

// @desc  Google OAuth callback handler
// @route GET /api/auth/google/callback  (after passport redirect)
export const googleAuthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = generateAccessToken(user._id, user.role);
  setTokenCookie(res, token);
  // Redirect to frontend
  res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
});
