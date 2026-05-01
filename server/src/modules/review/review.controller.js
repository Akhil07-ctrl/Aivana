import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Review from './review.model.js';
import Product from '../product/product.model.js';
import Order from '../order/order.model.js';

// @desc    Create a review for a product
// @route   POST /api/reviews/:productId
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;
  const userId = req.user._id;

  // Validate inputs
  if (!rating || !title || !comment) {
    throw new ApiError(400, 'Rating, title, and comment are required');
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ product: productId, user: userId });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  // Check if user has purchased this product (optional - for verified badge)
  const purchasedOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId,
    isPaid: true,
  });

  // Create review
  const review = await Review.create({
    product: productId,
    user: userId,
    rating,
    title,
    comment,
    verified: !!purchasedOrder, // true if user purchased this product
  });

  // Populate user info
  await review.populate('user', 'name');

  // Recalculate product average rating
  const allReviews = await Review.find({ product: productId });
  const avgRating = (
    allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length
  ).toFixed(1);

  product.averageRating = parseFloat(avgRating);
  product.numOfReviews = allReviews.length;
  await product.save();

  res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { sortBy = 'recent', page = 1, limit = 10 } = req.query;

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  let sortOption = { createdAt: -1 }; // Default: most recent first
  
  if (sortBy === 'helpful') {
    sortOption = { helpful: -1, createdAt: -1 };
  } else if (sortBy === 'highest') {
    sortOption = { rating: -1, createdAt: -1 };
  } else if (sortBy === 'lowest') {
    sortOption = { rating: 1, createdAt: -1 };
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments({ product: productId });

  res.json(
    new ApiResponse(200, {
      reviews,
      totalReviews: total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    }, 'Reviews fetched successfully')
  );
});

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const userId = req.user._id;

  // Find review
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Check if user is the review author
  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only update your own reviews');
  }

  // Update fields
  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;

  const updatedReview = await review.save();

  // Recalculate product average rating
  const allReviews = await Review.find({ product: review.product });
  const avgRating = (
    allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length
  ).toFixed(1);

  await Product.findByIdAndUpdate(review.product, {
    averageRating: parseFloat(avgRating),
    numOfReviews: allReviews.length,
  });

  res.json(new ApiResponse(200, updatedReview, 'Review updated successfully'));
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  // Find review
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  // Check if user is the review author or admin
  if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);

  // Recalculate product average rating
  const allReviews = await Review.find({ product: productId });
  
  if (allReviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  } else {
    const avgRating = (
      allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length
    ).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(avgRating),
      numOfReviews: allReviews.length,
    });
  }

  res.json(new ApiResponse(200, null, 'Review deleted successfully'));
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:reviewId/helpful
// @access  Public
export const markHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  );

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  res.json(new ApiResponse(200, review, 'Review marked as helpful'));
});

// @desc    Get reviews by user
// @route   GET /api/reviews/user/myreviews
// @access  Private
export const getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const reviews = await Review.find({ user: userId })
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, reviews, 'Your reviews fetched successfully'));
});
