import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from './ProductCard';
import { FiStar } from 'react-icons/fi';

export default function RecommendedProducts({ categoryContext }) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['ai-recommendations', categoryContext],
    queryFn: async () => {
      const p = categoryContext ? `?category=${categoryContext}` : '';
      const res = await axiosInstance.get(`/ai/recommend${p}`);
      return res.data.data;
    },
    staleTime: 60000 // Cache recommendations for a minute
  });

  if (isLoading || !products || products.length === 0) return null;

  return (
    <div className="my-16 bg-cream-50 p-8 rounded-3xl border border-rose-brand/10 shadow-sm relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-brand opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-rose-brand to-rose-300 rounded-full flex items-center justify-center text-white shadow-lg">
          <FiStar className="fill-white" size={18} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink leading-tight">AI Recommended for You</h2>
          <p className="text-sm text-ink-muted">Curated exclusively based on your interactions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
