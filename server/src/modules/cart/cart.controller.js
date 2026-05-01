import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Cart from './cart.model.js';
import Product from '../product/product.model.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getMyCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images slug');

  // If no cart exists, return empty cart instead of 404 so UI can handle it smoothly
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(new ApiResponse(200, cart, 'Cart fetched'));
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;

  // Validate required fields
  if (!productId) {
    throw new ApiError(400, 'Product ID is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, `Product not found with ID: ${productId}`);
  }

  // Verify stock for specific variant
  let variantStock = product.totalStock;
  if (size || color) {
    const variant = product.variants?.find(v => v.size === size && v.color === color);
    if (!variant) throw new ApiError(400, 'Requested size/color variant not found');
    variantStock = variant.stock;
  }

  if (variantStock < quantity) {
    throw new ApiError(400, `Not enough stock available. Available: ${variantStock}, Requested: ${quantity}`);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Check if exactly same item (product + size + color) already in cart
  const itemIndex = cart.items.findIndex(p =>
    p.product.toString() === productId && p.size === size && p.color === color
  );

  if (itemIndex > -1) {
    // Update existing item
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Push new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      size,
      color
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.json(new ApiResponse(200, cart, 'Item added to cart'));
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, size, color, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex(p =>
    p.product.toString() === productId && p.size === size && p.color === color
  );

  if (itemIndex === -1) throw new ApiError(404, 'Item not found in cart');

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.json(new ApiResponse(200, cart, 'Cart cleared'));
});
