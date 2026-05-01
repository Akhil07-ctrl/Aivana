import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Product from './product.model.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private (API Key)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

// @desc    Get all products (with filters & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;

  let query = { status: 'active' };

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  
  if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
    query.price = {};
    if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
  }

  // Sorting logic
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  const products = await Product.find(query)
    .sort(sortOption)
    .select('name slug price msrp images category totalStock averageRating numOfReviews status')
    .lean()
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProducts: total
    }, 'Products fetched successfully')
  );
});

// @desc    Get single product by slug or id
// @route   GET /api/products/:identifier
// @access  Public
export const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Try finding by ID first, if invalid try slug
  let product;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(identifier);
  } else {
    product = await Product.findOne({ slug: identifier });
  }

  if (!product) throw new ApiError(404, 'Product not found');

  res.json(new ApiResponse(200, product, 'Product fetched'));
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (API Key)
export const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) throw new ApiError(404, 'Product not found');

  // Re-save to trigger pre-save hooks (like total stock)
  await updatedProduct.save();

  res.json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (API Key)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');

  // Soft delete
  product.status = 'archived';
  await product.save();

  res.json(new ApiResponse(200, null, 'Product archived successfully'));
});
