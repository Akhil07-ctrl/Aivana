import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from './ProductCard';

export default function SimilarProducts({ productId, category }) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['similar-products', category, productId],
    queryFn: async () => {
      const res = await axiosInstance.get('/products', {
        params: { category, limit: 8 }
      });
      // Filter out the current product
      return res.data.data.products?.filter(p => p._id !== productId) || [];
    },
    enabled: !!category,
  });

  if (isLoading || !products || products.length === 0) return null;

  return (
    <div className="my-16">
      <h2 className="font-display text-3xl font-bold text-ink mb-8">Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
