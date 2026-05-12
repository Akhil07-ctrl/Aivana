import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Product from './product.model.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private (API Key)
export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;

  // Helper for Update or Insert logic
  const upsertItem = async (productData) => {
    if (!productData.name) return null;

    let product = await Product.findOne({
      name: { $regex: `^${productData.name.trim()}$`, $options: 'i' }
    });

    if (product) {
      // If msrp is missing in the new data, explicitly clear it
      // so it doesn't stick from a previous version of the product.
      if (productData.msrp === undefined) {
        product.msrp = undefined;
      }

      // Update existing
      Object.assign(product, productData);
      product.status = 'active';
      return await product.save();
    }
    // Create new
    return await Product.create(productData);
  };

  // Handle Array (Bulk)
  if (Array.isArray(data)) {
    const results = await Promise.all(data.map(item => upsertItem(item)));
    const successful = results.filter(r => r !== null);
    return res.status(201).json(new ApiResponse(201, successful, `${successful.length} products processed`));
  }

  // Handle Single Object
  if (!data.name) {
    return res.status(400).json(new ApiResponse(400, null, 'Product name is required'));
  }

  const result = await upsertItem(data);
  res.status(201).json(new ApiResponse(201, result, 'Product processed successfully'));
});

// @desc    Get all products (with filters & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { ids, category, subcategory, search, sort, page = 1, limit = 12, minPrice, maxPrice, isTrending } = req.query;
  
  let query = { status: 'active' };

  if (isTrending === 'true') {
    query.isTrending = true;
  }

  if (ids) {
    const idArray = ids.split(',').filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    query._id = { $in: idArray };
  }

  if (category) {
    if (category === 'Sale') {
      query.msrp = { $exists: true, $gt: 0 };
      query.$expr = { $gt: ["$msrp", "$price"] };
    } else {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }
  }

  if (subcategory) {
    if (subcategory === 'Sale') {
      query.msrp = { $exists: true, $gt: 0 };
      query.$expr = { $gt: ["$msrp", "$price"] };
    } else {
      query.subcategory = { $regex: `^${subcategory}$`, $options: 'i' };
    }
  }
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

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = asyncHandler(async (req, res) => {
  console.log('Fetching trending products...');
  const limit = parseInt(req.query.limit) || 8;
  
  const products = await Product.find({ isTrending: true, status: 'active' })
    .select('name slug price msrp images category totalStock averageRating numOfReviews status')
    .limit(limit)
    .sort({ updatedAt: -1 });

  res.json(new ApiResponse(200, products, 'Trending products fetched successfully'));
});
