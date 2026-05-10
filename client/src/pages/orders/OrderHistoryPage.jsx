import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiMapPin, FiCreditCard, FiRepeat, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
  const { addToCart } = useCartStore();
  const [expandedOrders, setExpandedOrders] = useState({});

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/orders/my-orders');
      return response.data.data;
    },
  });

  const toggleOrder = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReorder = async (orderItems) => {
    const toastId = toast.loading('Adding items to cart...');
    try {
      for (const item of orderItems) {
        await addToCart({
          productId: item.product?._id || item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          productData: {
            name: item.name,
            price: item.price,
            images: [{ url: item.image }]
          }
        });
      }
      toast.success('All items added to cart! 🛍️', { id: toastId });
    } catch (err) {
      toast.error('Failed to add some items', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-brand rounded-full animate-spin" />
      </PageWrapper>
    );
  }

  if (isError || !orders || orders.length === 0) {
    return (
      <PageWrapper className="py-20 lg:py-32 flex items-center justify-center min-h-[70vh]">
        <div className="container-main max-w-2xl px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-12 lg:p-20 shadow-xl shadow-cream-200 border border-cream-100 text-center"
          >
            <motion.div 
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-24 h-24 bg-cream-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-cream-200 shadow-inner"
            >
              <FiPackage size={48} className="text-rose-brand/40" />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-ink mb-4">No orders yet</h2>
            <p className="text-ink-muted mb-12 text-lg leading-relaxed">Your style journey is just beginning. Explore our latest collections and find your perfect fit.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-3 px-10 py-4 shadow-xl shadow-rose-brand/20 text-lg">
              Start Shopping <FiChevronRight />
            </Link>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-[#fcfaf9] pt-12 pb-24 min-h-screen">
      <div className="container-main max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-ink mb-3 tracking-tight">
              Order History
            </h1>
            <p className="text-ink-muted text-lg">Manage your style investments and track deliveries.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 sm:gap-6"
          >
            {[
              { label: 'All', count: orders.length, color: 'bg-ink text-white' },
              { label: 'Pending', count: orders.filter(o => !o.isDelivered).length, color: 'bg-rose-50 text-rose-brand border border-rose-100' },
              { label: 'Delivered', count: orders.filter(o => o.isDelivered).length, color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
            ].map((stat, i) => (
              <div key={i} className={`px-4 py-3 rounded-2xl flex flex-col items-center min-w-[80px] sm:min-w-[100px] shadow-sm ${stat.color}`}>
                <span className="text-xl font-bold">{stat.count}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order, index) => {
            const isExpanded = expandedOrders[order._id];
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] border border-cream-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-brand/5 transition-all duration-500"
              >
                {/* Card Header */}
                <div className="p-6 sm:p-10 border-b border-cream-100">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${order.isDelivered ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-brand'}`}>
                        <FiPackage size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-ink">Order #{order._id.slice(-8).toUpperCase()}</h3>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            order.isDelivered ? 'bg-emerald-100 text-emerald-700' : 
                            order.isPaid ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.isDelivered ? 'Arrived' : order.isPaid ? 'In Progress' : 'Unpaid'}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
                          <span className="flex items-center gap-1.5 font-medium"><FiClock /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="w-1.5 h-1.5 bg-cream-300 rounded-full" />
                          <span className="text-ink font-bold text-lg">₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <Link
                        to={`/track-order/${order._id}`}
                        className="btn-primary flex-1 lg:flex-none px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-rose-brand/10"
                      >
                        Track
                      </Link>
                      <button
                        onClick={() => handleReorder(order.orderItems)}
                        className="btn-outline flex-1 lg:flex-none px-6 py-3 rounded-xl text-xs uppercase tracking-widest bg-white flex items-center justify-center gap-2"
                      >
                        <FiRepeat /> Reorder
                      </button>
                      <button
                        onClick={() => toggleOrder(order._id)}
                        className="p-3 bg-cream-50 text-ink-muted rounded-xl hover:bg-ink hover:text-white transition-all"
                      >
                        {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Detailed Meta Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-cream-100 bg-cream-50/50">
                        <div className="p-6 border-b md:border-b-0 md:border-r border-cream-100">
                          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FiMapPin className="text-rose-brand" /> Shipping To
                          </p>
                          <p className="text-sm font-bold text-ink leading-relaxed">
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                          </p>
                        </div>
                        <div className="p-6 border-b md:border-b-0 md:border-r border-cream-100">
                          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FiCreditCard className="text-rose-brand" /> Payment Method
                          </p>
                          <p className="text-sm font-bold text-ink">{order.paymentMethod || 'Razorpay'}</p>
                          <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight mt-1">Transaction Secured</p>
                        </div>
                        <div className="p-6">
                          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <FiHelpCircle className="text-rose-brand" /> Need Help?
                          </p>
                          <button className="text-sm font-bold text-rose-brand hover:underline">Contact Support</button>
                          <p className="text-[10px] text-ink-muted mt-1">Available 24/7 for you</p>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="bg-white p-6 sm:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                          {order.orderItems.map((item, idx) => (
                            <motion.div 
                              key={idx} 
                              whileHover={{ x: 5 }}
                              className="flex gap-5 items-center group/item"
                            >
                              <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden border border-cream-200 flex-shrink-0 shadow-sm relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                <div className="absolute inset-0 bg-ink/0 group-hover/item:bg-ink/5 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <Link to={`/products/${item.product?.slug || '#'}`} className="text-lg font-bold text-ink hover:text-rose-brand transition-colors line-clamp-1">
                                  {item.name}
                                </Link>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                  {item.size && (
                                    <span className="text-[11px] font-bold text-ink-muted bg-cream-50 px-2 py-0.5 rounded-md uppercase">
                                      Size: <span className="text-rose-brand">{item.size}</span>
                                    </span>
                                  )}
                                  {item.color && (
                                    <span className="text-[11px] font-bold text-ink-muted bg-cream-50 px-2 py-0.5 rounded-md uppercase">
                                      Color: <span className="text-rose-brand">{item.color}</span>
                                    </span>
                                  )}
                                  <span className="text-[11px] font-bold text-ink-muted bg-cream-50 px-2 py-0.5 rounded-md uppercase">
                                    Qty: <span className="text-ink">{item.quantity}</span>
                                  </span>
                                </div>
                                <p className="mt-3 font-bold text-ink">₹{item.price.toLocaleString()}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Progress Bar Footer (Simplified Visual) */}
                <div className="px-10 py-5 bg-white border-t border-cream-100 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-cream-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: order.isDelivered ? '100%' : order.isPaid ? '40%' : '10%' }}
                      className={`h-full ${order.isDelivered ? 'bg-emerald-500' : 'bg-rose-brand'}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest whitespace-nowrap">
                    {order.isDelivered ? 'Order Fulfilled' : 'Arriving Soon'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
