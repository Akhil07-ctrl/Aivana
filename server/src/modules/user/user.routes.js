import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import User from './user.model.js';
import cloudinary from '../../config/cloudinary.js';
import multer from 'multer';

const router = express.Router();

// Multer memory storage for avatar uploads (we upload to Cloudinary manually)
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed'), false);
    }
  },
});

// @desc  Get user profile
// @route GET /api/users/profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');
  return res.json(new ApiResponse(200, user, 'Profile fetched'));
}));

// @desc  Update user profile (name, email)
// @route PUT /api/users/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) {
    if (name.length < 2 || name.length > 50) {
      throw new ApiError(400, 'Name must be between 2 and 50 characters');
    }
    user.name = name.trim();
  }

  if (email && email !== user.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Please enter a valid email address');
    }
    const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (exists) throw new ApiError(409, 'This email is already in use by another account');
    user.email = email.toLowerCase().trim();
  }

  await user.save({ validateBeforeSave: false });
  return res.json(new ApiResponse(200, user, 'Profile updated successfully'));
}));

// @desc  Upload/Update avatar
// @route PUT /api/users/avatar
router.put('/avatar', protect, avatarUpload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please upload an image');

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  // Delete old avatar from Cloudinary if exists
  if (user.avatar?.publicId) {
    try {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    } catch (err) {
      console.warn('[CLOUDINARY] Failed to delete old avatar:', err.message);
    }
  }

  // Upload new avatar to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'aivana/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(req.file.buffer);
  });

  user.avatar = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(200, user, 'Avatar updated successfully'));
}));

// @desc  Delete user address
// @route DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );
  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(200, user, 'Address deleted'));
}));

// @desc  Add user address
// @route POST /api/users/addresses
router.post('/addresses', protect, asyncHandler(async (req, res) => {
  const { fullName, phone, line1, line2, city, state, pincode, label, isDefault } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const newAddress = { fullName, phone, line1, line2, city, state, pincode, label, isDefault: isDefault || false };

  if (newAddress.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  } else if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  user.addresses.push(newAddress);
  await user.save({ validateBeforeSave: false });

  return res.json(new ApiResponse(201, user, 'Address added successfully'));
}));

// @desc  Update user address
// @route PUT /api/users/addresses/:addressId
router.put('/addresses/:addressId', protect, asyncHandler(async (req, res) => {
  const { fullName, phone, line1, line2, city, state, pincode, label, isDefault } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, 'Address not found');

  if (fullName) address.fullName = fullName;
  if (phone) address.phone = phone;
  if (line1) address.line1 = line1;
  if (line2 !== undefined) address.line2 = line2;
  if (city) address.city = city;
  if (state) address.state = state;
  if (pincode) address.pincode = pincode;
  if (label) address.label = label;

  if (isDefault !== undefined) {
    address.isDefault = isDefault;
    if (isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== req.params.addressId) addr.isDefault = false;
      });
    }
  }

  await user.save({ validateBeforeSave: false });
  return res.json(new ApiResponse(200, user, 'Address updated successfully'));
}));

export default router;
