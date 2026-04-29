import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const validateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    throw new ApiError(401, 'Invalid or missing API Key');
  }

  next();
});
