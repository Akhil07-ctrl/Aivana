import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function OrderHistoryPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/orders/my-orders');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-brand rounded-full animate-spin" />
      </PageWrapper>
    );
  }

  if (isError || !orders || orders.length === 0) {
    return (
      <PageWrapper className="py-20 text-center">
        <div className="container-main max-w-2xl">
          <div className="bg-white rounded-3xl p-12 shadow-card">
            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage size={40} className="text-ink-muted" />
            </div>
            <h2 className="text-3xl font-display text-ink mb-4">No orders yet</h2>
            <p className="text-ink-muted mb-10">Your style journey is just beginning. Explore our latest collections and find your perfect fit.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Start Shopping <FiChevronRight />
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-cream-100 pt-10 pb-24">
      <div className="container-main max-w-4xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-display text-ink mb-2">My Orders</h1>
            <p className="text-ink-muted">Track and manage your style investments</p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-2xl font-display text-ink">{orders.length}</span>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Total Orders</p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden group">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-cream-100 rounded-2xl flex items-center justify-center text-rose-brand">
                    <FiPackage size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-1 uppercase tracking-tight">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-ink-muted">
                      <span className="flex items-center gap-1">
                        <FiClock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-cream-300 rounded-full" />
                      <span className="font-medium text-ink">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-cream-200 text-ink-muted'
                  }`}>
                    {order.status === 'delivered' ? <FiCheckCircle /> : 
                     order.status === 'shipped' ? <FiTruck /> : <FiClock />}
                    {order.status}
                  </div>
                  
                  <Link 
                    to={`/track-order/${order._id}`}
                    className="btn-outline py-2 px-6 rounded-full text-xs uppercase tracking-widest"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
