import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import HomePage from '../features/home/HomePage';
import ShopPage from '../features/shop/ShopPage';
import ProductDetailPage from '../features/shop/ProductDetailPage';
import WishlistPage from '../features/shop/WishlistPage';
import CheckoutPage from '../features/checkout/CheckoutPage';
import TrackOrderPage from '../features/orders/TrackOrderPage';
import OrderHistoryPage from '../features/orders/OrderHistoryPage';
import MainLayout from '../components/layout/MainLayout';
import useAuthStore from '../store/authStore';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  
  if (!isInitialized) return null; // Or a loading spinner
  return user ? children : <Navigate to="/login" replace />;
}

// Placeholder pages
const Placeholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100">
    <div className="text-center">
      <h1 className="font-display text-4xl text-ink font-bold">{title}</h1>
      <p className="text-ink-muted mt-2">Coming soon — being built! 🚀</p>
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (Standalone Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth-success" element={<Navigate to="/" replace />} />

        {/* Main Application Layout (Has Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<Placeholder title="Categories directory is actively being curated. Check back soon!" />} />
          <Route path="/about" element={<Placeholder title="Discover the Aivana Story" />} />

          {/* Protected Features */}
          <Route path="/cart" element={<Placeholder title="Cart" />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/track/:awb" element={<TrackOrderPage />} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><Placeholder title="Profile" /></ProtectedRoute>} />
        </Route>

        {/* Redirect any unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
