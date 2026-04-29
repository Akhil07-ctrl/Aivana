import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Category from './category.model.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(new ApiResponse(200, categories, 'Categories fetched'));
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const slug = slugify(name, { lower: true });

  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    return res.status(400).json(new ApiResponse(400, null, 'Category already exists'));
  }

  const category = await Category.create({ name, slug, description, image });
  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});
