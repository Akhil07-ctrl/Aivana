import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mockProducts = [
  {
    id: '1',
    name: 'Silk Evening Gown',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1572804013309-82a89b4f945a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Dresses',
  },
  {
    id: '2',
    name: 'Minimalist Leather Tote',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
  },
  {
    id: '3',
    name: 'Cashmere Blend Coat',
    price: 320.00,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Outerwear',
  },
  {
    id: '4',
    name: 'Signature Gold Hoops',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Jewelry',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="container-main">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-4xl text-ink font-bold mb-3">Trending Now</h2>
            <p className="text-ink-muted">Curated picks for the current season.</p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex text-rose-brand font-semibold hover:underline">
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover Quick Action */}
                <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button className="w-full bg-white text-ink py-3 rounded-lg font-semibold shadow-lg hover:bg-rose-brand hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                    Quick Add
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 font-medium">{product.category}</p>
                <h3 className="font-semibold text-ink text-lg mb-1 group-hover:text-rose-brand transition-colors">
                  {product.name}
                </h3>
                <p className="text-ink-light font-medium">${product.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to="/shop" className="btn-outline inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
