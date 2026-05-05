import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../modules/user/user.model.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.aivana_token) {
    token = req.cookies.aivana_token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw new ApiError(401, 'Please login to access this resource');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      throw new ApiError(401, 'User associated with this token no longer exists.');
    }
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});
