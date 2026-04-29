import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Order from './order.model.js';
import Product from '../product/product.model.js';
import { sendEmail, generateOrderConfirmationEmail, generateOrderDeliveredEmail } from '../../utils/sendEmail.js';

// Setup Razorpay instance (using env vars, defaulting to test keys if empty)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret',
});

// @desc    Create new order & initiate Razorpay payment
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  // Generate Razorpay Order
  const options = {
    amount: Math.round(totalPrice * 100), // Razorpay amount is in paise (smallest currency unit)
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  if (!razorpayOrder) {
    throw new ApiError(500, 'Failed to create Razorpay order');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod: 'Razorpay',
    paymentResult: {
      razorpay_order_id: razorpayOrder.id,
      status: 'created'
    }
  });

  const createdOrder = await order.save();

  res.status(201).json(new ApiResponse(201, {
    orderId: createdOrder._id,
    razorpayOrderId: razorpayOrder.id,
    currency: razorpayOrder.currency,
    amount: razorpayOrder.amount,
  }, 'Order created successfully'));
});

// @desc    Verify Razorpay payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Creating signature for verification
  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new ApiError(400, 'Payment signature verification failed');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: 'captured',
    update_time: new Date().toISOString(),
  };

  const updatedOrder = await order.save();

  // Deduct stock for each item
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
      if (variant && variant.stock > 0) {
        variant.stock -= item.quantity;
      }
      product.totalStock -= item.quantity;
      await product.save();
    }
  }

  // Fire Order Confirmation Email asynchronously
  const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'name email');
  if (populatedOrder && populatedOrder.user) {
    sendEmail({
      to: populatedOrder.user.email,
      subject: `Aivana Order Confirmation #${populatedOrder._id.toString().substring(populatedOrder._id.toString().length - 8).toUpperCase()}`,
      template: generateOrderConfirmationEmail(populatedOrder, populatedOrder.user)
    }).catch(e => console.error("Email err", e));
  }

  res.json(new ApiResponse(200, updatedOrder, 'Payment verified successfully'));
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, orders, 'Orders fetched'));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Ensure users can only see their own orders
  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.json(new ApiResponse(200, order, 'Order fetched'));
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (API Key)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, orders, 'All orders fetched'));
});

// @desc    Mark order as delivered
// @route   PATCH /api/orders/:id/mark-delivered
// @access  Private (Admin)
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  // Send delivery confirmation email
  if (order.user) {
    sendEmail({
      to: order.user.email,
      subject: `Your Aivana Order Has Been Delivered! 🎉`,
      template: generateOrderDeliveredEmail(updatedOrder, order.user)
    }).catch(e => console.error('[DELIVERY EMAIL ERROR]', e));
  }

  res.json(new ApiResponse(200, updatedOrder, 'Order marked as delivered'));
});
