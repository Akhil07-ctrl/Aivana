import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Order from '../order/order.model.js';
import { sendEmail, generateShipmentConfirmationEmail } from '../../utils/sendEmail.js';

// @desc    Calculate mock shipping rates based on postal code
// @route   POST /api/delivery/rates
// @access  Public
export const calculateShippingRates = asyncHandler(async (req, res) => {
  const { pickup_postcode, delivery_postcode, weight } = req.body;

  // In a real scenario, you would hit the Shiprocket API:
  // POST https://apiv2.shiprocket.in/v1/external/courier/generate/lists

  // Simulated rates
  const rates = [
    { courier_name: "Delhivery", rate: 65.0, est_delivery_days: 3 },
    { courier_name: "Blue Dart", rate: 120.0, est_delivery_days: 1 },
    { courier_name: "XpressBees", rate: 50.0, est_delivery_days: 5 },
  ];

  res.json(new ApiResponse(200, { rates }, 'Shipping rates calculated'));
});


// @desc    Create a mock shipment for an order
// @route   POST /api/delivery/shipment
// @access  Private/Admin
export const createShipment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
  }

  // Simulate pushing order to Shiprocket
  const mockAwb = `SR${Math.floor(Math.random() * 1000000000)}`;
  const mockShipmentId = Math.floor(Math.random() * 1000000);

  const shipmentData = {
    awb_code: mockAwb,
    shipment_id: mockShipmentId,
    courier_name: "Blue Dart",
    status: "Manifested",
  };

  order.shippingResult = shipmentData;

  // Once manifested, it's considered generally en-route
  order.isDelivered = false;

  const updatedOrder = await order.save();

  // Send shipment confirmation email asynchronously
  if (order.user) {
    sendEmail({
      to: order.user.email,
      subject: `Your Aivana Order is Shipped! 📦 - Tracking: ${mockAwb}`,
      template: generateShipmentConfirmationEmail(updatedOrder, shipmentData, order.user)
    }).catch(e => console.error('[DELIVERY EMAIL ERROR]', e));
  }

  res.json(new ApiResponse(200, {
    awb: mockAwb,
    shipmentId: mockShipmentId
  }, 'Shipment created successfully'));
});

// @desc    Track a shipment by AWB
// @route   GET /api/delivery/track/:awb
// @access  Public
export const trackShipment = asyncHandler(async (req, res) => {
  const { awb } = req.params;

  // Real API: GET https://apiv2.shiprocket.in/v1/external/courier/track/awb/{{awb}}
  // Mock tracking timelines
  const trackingData = {
    awb: awb,
    current_status: "In Transit",
    expected_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    tracking_history: [
      { status: "Manifested", location: "Warehouse", time: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: "Picked Up", location: "Delhi Hub", time: new Date(Date.now() - 86400000 * 1).toISOString() },
      { status: "In Transit", location: "Mumbai Hub", time: new Date().toISOString() },
    ]
  };

  res.json(new ApiResponse(200, trackingData, 'Tracking info retrieved'));
});
