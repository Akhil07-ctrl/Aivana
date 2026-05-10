import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CartDrawer from '../components/cart/CartDrawer';
import AiChatbot from '../components/chat/AiChatbot';
import ScrollToTop from '../components/common/ScrollToTop';
import useAuthStore from '../store/authStore';

// Lazy-loaded page chunks — each becomes its own JS bundle
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const AboutPage = lazy(() => import('../pages/home/AboutPage'));
const ShopPage = lazy(() => import('../pages/shop/ShopPage'));
const CategoriesPage = lazy(() => import('../pages/shop/CategoriesPage'));
const ProductDetailPage = lazy(() => import('../pages/shop/ProductDetailPage'));
const WishlistPage = lazy(() => import('../pages/shop/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));
const TrackOrderPage = lazy(() => import('../pages/orders/TrackOrderPage'));
const OrderHistoryPage = lazy(() => import('../pages/orders/OrderHistoryPage'));
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));

import LoadingScreen from '../components/ui/LoadingScreen';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return <LoadingScreen />;
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
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Auth (Standalone Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/oauth-success" element={<Navigate to="/" replace />} />

          {/* Main Application Layout (Has Navbar & Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Protected Features */}
            <Route path="/cart" element={<Placeholder title="Cart" />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/track-order/:awb" element={<TrackOrderPage />} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>

          {/* Redirect any unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <CartDrawer />
      <AiChatbot />
    </BrowserRouter>
  );
}
