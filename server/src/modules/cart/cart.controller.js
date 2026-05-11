import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Cart from './cart.model.js';
import Product from '../product/product.model.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getMyCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images slug price');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  } else {
    // CLEANUP: Filter out items whose product was deleted from DB (null after populate)
    const originalCount = cart.items.length;
    cart.items = cart.items.filter(item => item.product !== null);
    
    // If we removed something, save the cleaned cart
    if (cart.items.length !== originalCount) {
      await cart.save();
    }
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
    const variant = product.variants?.find(v => {
      const vSize = (v.size || "").trim().toLowerCase();
      const reqSize = (size || "").trim().toLowerCase();
      const vColor = (v.color || "").trim().toLowerCase();
      const reqColor = (color || "").trim().toLowerCase();

      // Flexible matching:
      // 1. Exact match (after normalization)
      // 2. If requested size is empty, it can match "one size", "n/a", or empty in DB
      const sizeMatch = vSize === reqSize || (reqSize === "" && (vSize === "one size" || vSize === "n/a" || vSize === ""));
      const colorMatch = vColor === reqColor || (reqColor === "" && (vColor === "one size" || vColor === "n/a" || vColor === ""));
      
      return sizeMatch && colorMatch;
    });

    if (!variant) {
      throw new ApiError(400, 'Requested size/color variant not found');
    }
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

  const itemIndex = cart.items.findIndex(p => {
    const vSize = (p.size || "").trim().toLowerCase();
    const reqSize = (size || "").trim().toLowerCase();
    const vColor = (p.color || "").trim().toLowerCase();
    const reqColor = (color || "").trim().toLowerCase();

    const sizeMatch = vSize === reqSize || (reqSize === "" && (vSize === "one size" || vSize === "n/a" || vSize === ""));
    const colorMatch = vColor === reqColor || (reqColor === "" && (vColor === "one size" || vColor === "n/a" || vColor === ""));
    
    return p.product.toString() === productId && sizeMatch && colorMatch;
  });

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

// @desc    Sync local cart with server
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body; // array of local cart items

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  if (items && Array.isArray(items) && items.length > 0) {
    for (const localItem of items) {
      if (!localItem.product) continue;
      
      const productId = localItem.product._id || localItem.product;
      
      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) continue;

      const itemIndex = cart.items.findIndex(p => {
        const vSize = (p.size || "").trim().toLowerCase();
        const reqSize = (localItem.size || "").trim().toLowerCase();
        const vColor = (p.color || "").trim().toLowerCase();
        const reqColor = (localItem.color || "").trim().toLowerCase();

        const sizeMatch = vSize === reqSize || (reqSize === "" && (vSize === "one size" || vSize === "n/a" || vSize === ""));
        const colorMatch = vColor === reqColor || (reqColor === "" && (vColor === "one size" || vColor === "n/a" || vColor === ""));
        
        return p.product.toString() === productId.toString() && sizeMatch && colorMatch;
      });

      if (itemIndex > -1) {
        // Ensure quantity doesn't exceed stock? For simplicity, we just add it and assume stock is handled at checkout
        cart.items[itemIndex].quantity += localItem.quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: localItem.quantity,
          price: product.price,
          size: localItem.size,
          color: localItem.color
        });
      }
    }
    await cart.save();
  }

  await cart.populate('items.product', 'name images slug');
  res.json(new ApiResponse(200, cart, 'Cart synced successfully'));
});
