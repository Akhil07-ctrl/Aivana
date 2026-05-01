import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import OptimizedImage from '../../components/ui/OptimizedImage';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return toast.error('Please fill in all shipping fields');
    }

    setLoading(true);

    try {
      // 1. Create order on backend (returns razorpayOrderId)
      const orderPayload = {
        orderItems: cart.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.images[0]?.url || '',
          price: item.price,
          size: item.size,
          color: item.color,
          product: item.product._id,
          vendorId: item.product.vendorId // Removed user fallback
        })),
        shippingAddress,
        itemsPrice: cart.totalPrice,
        taxPrice: cart.totalPrice * 0.18, // 18% GST example
        shippingPrice: cart.totalPrice > 500 ? 0 : 50, // Free shipping over 500
        totalPrice: cart.totalPrice + (cart.totalPrice * 0.18) + (cart.totalPrice > 500 ? 0 : 50),
      };

      const orderRes = await axiosInstance.post('/orders', orderPayload);
      const { orderId, razorpayOrderId, amount, currency } = orderRes.data.data;

      // 2. Load Razorpay SDK
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: amount.toString(),
        currency: currency,
        name: 'Aivana Fashion',
        description: 'Premium Order Checkout',
        image: 'https://via.placeholder.com/150?text=Aivana', // Add real logo URL later
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            toast.loading('Verifying payment...', { id: 'verify' });

            // 4. Verify Payment on Backend
            await axiosInstance.post(`/orders/${orderId}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success('Payment successful! 🎉', { id: 'verify' });
            clearCart();
            navigate('/orders'); // Redirect to order history
          } catch (err) {
            toast.error('Payment verification failed', { id: 'verify' });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: shippingAddress.phone
        },
        theme: {
          color: '#E8506A' // Rose Brand color
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  const taxPrice = cart.totalPrice * 0.18;
  const shippingPrice = cart.totalPrice > 500 ? 0 : 50;
  const finalTotal = cart.totalPrice + taxPrice + shippingPrice;

  return (
    <PageWrapper className="bg-cream-50 pt-10 pb-24">
      <div className="container-main max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-ink mb-10 border-b border-cream-200 pb-4">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-cream-200 h-fit">
            <h2 className="text-xl font-bold text-ink mb-6">Shipping Details</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Full Address</label>
                <input
                  type="text" name="address" value={shippingAddress.address} onChange={handleInputChange}
                  className="w-full bg-cream-50 border border-cream-300 rounded-lg p-3 text-ink focus:border-rose-brand outline-none transition"
                  placeholder="Street address, apartment, suite" required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">City</label>
                  <input
                    type="text" name="city" value={shippingAddress.city} onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-300 rounded-lg p-3 text-ink focus:border-rose-brand outline-none transition" required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Postal Code</label>
                  <input
                    type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-300 rounded-lg p-3 text-ink focus:border-rose-brand outline-none transition" required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Country</label>
                  <input
                    type="text" name="country" value={shippingAddress.country} onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-300 rounded-lg p-3 text-ink focus:border-rose-brand outline-none transition" required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Phone Number</label>
                  <input
                    type="tel" name="phone" value={shippingAddress.phone} onChange={handleInputChange}
                    className="w-full bg-cream-50 border border-cream-300 rounded-lg p-3 text-ink focus:border-rose-brand outline-none transition" required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-ink text-white p-8 rounded-2xl shadow-xl h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 border-b border-white/20 pb-6 max-h-60 overflow-y-auto pr-2">
              {cart.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-20 bg-cream-100 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                    <OptimizedImage src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} alt="product" width={100} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold line-clamp-1">{item.product?.name}</p>
                    <p className="text-cream-300/70 text-xs mt-1">
                      {item.size && <span>Size: {item.size} </span>}
                      {item.color && <span>| Color: {item.color} </span>}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-cream-300">Qty: {item.quantity}</span>
                      <span className="font-bold">₹{(item.price * item.quantity)?.toLocaleString('en-IN') || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm mb-6 border-b border-white/20 pb-6">
              <div className="flex justify-between text-cream-300">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice?.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Estimated Tax (18%)</span>
                <span>₹{taxPrice?.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice?.toLocaleString('en-IN')}`}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-8">
              <span>Total</span>
              <span>₹{finalTotal?.toLocaleString('en-IN') || 'N/A'}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-rose-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-light transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <span className="animate-pulse">Processing...</span> : 'Pay via Razorpay'}
            </button>
            <p className="text-center text-xs text-cream-300/50 mt-4">Safe and secure payments powered by Razorpay</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
