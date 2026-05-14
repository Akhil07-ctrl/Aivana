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

  // Normalization helper
  const isOneSize = (s) => ["one size", "n/a", "none", ""].includes((s || "").trim().toLowerCase());
  const normalize = (s) => (s || "").trim().toLowerCase();

  // Verify stock for specific variant and get canonical specs
  let variantStock = product.totalStock;
  let canonicalSize = size;
  let canonicalColor = color;

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find(v => {
      const vSize = normalize(v.size);
      const reqSize = normalize(size);
      const vColor = normalize(v.color);
      const reqColor = normalize(color);

      const sizeMatch = vSize === reqSize || (isOneSize(vSize) && isOneSize(reqSize));
      const colorMatch = vColor === reqColor || (isOneSize(vColor) && isOneSize(reqColor));
      
      return sizeMatch && colorMatch;
    });

    if (variant) {
      variantStock = variant.stock;
      canonicalSize = variant.size;
      canonicalColor = variant.color;
    } else if (size || color) {
      throw new ApiError(400, 'Requested size/color variant not found');
    } else {
      // If no specs provided, use first variant as default
      variantStock = product.variants[0].stock;
      canonicalSize = product.variants[0].size;
      canonicalColor = product.variants[0].color;
    }
  }

  if (variantStock < quantity) {
    throw new ApiError(400, `Not enough stock available. Available: ${variantStock}, Requested: ${quantity}`);
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Check if exactly same item (product + size + color) already in cart using canonical values
  const itemIndex = cart.items.findIndex(p => {
    const pSize = normalize(p.size);
    const cSize = normalize(canonicalSize);
    const pColor = normalize(p.color);
    const cColor = normalize(canonicalColor);

    const sizeMatch = pSize === cSize || (isOneSize(pSize) && isOneSize(cSize));
    const colorMatch = pColor === cColor || (isOneSize(pColor) && isOneSize(cColor));

    return p.product.toString() === productId && sizeMatch && colorMatch;
  });

  if (itemIndex > -1) {
    // Update existing item
    cart.items[itemIndex].quantity += quantity;
    // Update to canonical specs if they were previously empty
    cart.items[itemIndex].size = canonicalSize;
    cart.items[itemIndex].color = canonicalColor;
  } else {
    // Push new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      size: canonicalSize,
      color: canonicalColor
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

  const isOneSize = (s) => ["one size", "n/a", "none", ""].includes((s || "").trim().toLowerCase());
  const normalize = (s) => (s || "").trim().toLowerCase();

  const itemIndex = cart.items.findIndex(p => {
    const pSize = normalize(p.size);
    const reqSize = normalize(size);
    const pColor = normalize(p.color);
    const reqColor = normalize(color);

    const sizeMatch = pSize === reqSize || (isOneSize(pSize) && isOneSize(reqSize));
    const colorMatch = pColor === reqColor || (isOneSize(pColor) && isOneSize(reqColor));
    
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

      const isOneSize = (s) => ["one size", "n/a", "none", ""].includes((s || "").trim().toLowerCase());
      const normalize = (s) => (s || "").trim().toLowerCase();

      const itemIndex = cart.items.findIndex(p => {
        const pSize = normalize(p.size);
        const reqSize = normalize(localItem.size);
        const pColor = normalize(p.color);
        const reqColor = normalize(localItem.color);

        const sizeMatch = pSize === reqSize || (isOneSize(pSize) && isOneSize(reqSize));
        const colorMatch = pColor === reqColor || (isOneSize(pColor) && isOneSize(reqColor));
        
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
