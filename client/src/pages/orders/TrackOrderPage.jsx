import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiChevronLeft } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import { format } from 'date-fns';

export default function TrackOrderPage() {
  const { awb } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tracking', awb],
    queryFn: async () => {
      const res = await axiosInstance.get(`/delivery/track/${awb}`);
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <PageWrapper className="justify-center items-center bg-cream-50">
        <div className="w-10 h-10 border-4 border-rose-brand border-t-transparent rounded-full animate-spin"></div>
      </PageWrapper>
    );
  }

  if (isError || !data) {
    return (
      <PageWrapper className="justify-center items-center bg-cream-50">
        <h2 className="text-2xl font-bold text-ink mb-4">Tracking Information Not Found</h2>
        <p className="text-ink-muted mb-6">We couldn't locate AWB: {awb}</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-cream-50 pt-10 pb-24">
      <div className="container-main max-w-3xl">
        <Link to="/shop" className="inline-flex items-center gap-2 text-ink-muted hover:text-rose-brand mb-8 transition-colors">
          <FiChevronLeft /> Back to Shop
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cream-200 pb-6 mb-8 gap-4">

            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">Track Shipment</h1>
              <p className="text-ink-muted font-mono">AWB: {data.awb}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-muted mb-1">Estimated Delivery</p>
              <p className="text-lg font-bold text-ink">{format(new Date(data.expected_date), 'EEEE, MMM dd')}</p>
            </div>
          </div>

          <div className="relative pl-8 md:pl-0">
            {/* Desktop Line */}
            <div className="hidden md:block absolute top-[24px] left-8 right-8 h-1 bg-cream-200 z-0"></div>

            {/* Mobile Line */}
            <div className="md:hidden absolute top-8 bottom-8 left-[15px] w-1 bg-cream-200 z-0"></div>

            <div className="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-0">
              {data.tracking_history.map((event, idx) => {
                const isLast = idx === data.tracking_history.length - 1;
                let Icon = FiPackage;
                if (event.status === 'In Transit' || event.status === 'Picked', event.status === 'Picked Up') Icon = FiTruck;
                if (event.status === 'Delivered') Icon = FiCheckCircle;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1 text-left md:text-center"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isLast ? 'bg-rose-brand text-white shadow-lg ring-4 ring-rose-100' : 'bg-ink text-white'
                      }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isLast ? 'text-rose-brand text-lg' : 'text-ink'}`}>{event.status}</h3>
                      <p className="text-sm text-ink-muted mt-1">{event.location}</p>
                      <p className="text-xs text-cream-400 mt-1">{format(new Date(event.time), 'MMM dd, hh:mm a')}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
