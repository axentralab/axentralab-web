import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';
import Navbar    from './components/layout/Navbar';
import Footer    from './components/layout/Footer';
import AIChatbot from './components/common/AIChatbot';

import './styles/global.css';

import HomePage        from './pages/HomePage';
import ShopPage        from './pages/ShopPage';
import ProductsPage    from './pages/ProductsPage';
import PortfolioPage   from './pages/PortfolioPage';
import TeamPage        from './pages/TeamPage';
import BlogPage        from './pages/BlogPage';
import BlogPostPage    from './pages/BlogPostPage';
import ContactPage     from './pages/ContactPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ReferralPage    from './pages/ReferralPage';
import QuoteCalculator from './components/common/QuoteCalculator';
import CartPage         from './pages/CartPage';
import CheckoutPage     from './pages/CheckoutPage';
import DashboardPage    from './pages/DashboardPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage        from './pages/AdminPage';
import NotFoundPage     from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
              <div className="grid-bg" />
              <ScrollToTop />
              <AIChatbot />
              <Routes>
                <Route path="/"          element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/services"  element={<PublicLayout><ShopPage /></PublicLayout>} />
                <Route path="/products"  element={<PublicLayout><ProductsPage /></PublicLayout>} />
                <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
                <Route path="/team"      element={<PublicLayout><TeamPage /></PublicLayout>} />
                <Route path="/blog"      element={<PublicLayout><BlogPage /></PublicLayout>} />
                <Route path="/blog/:id"  element={<PublicLayout><BlogPostPage /></PublicLayout>} />
                <Route path="/contact"   element={<PublicLayout><ContactPage /></PublicLayout>} />
                <Route path="/quote"     element={<PublicLayout><QuoteCalculator /></PublicLayout>} />
                <Route path="/login"     element={<LoginPage />} />
                <Route path="/register"  element={<RegisterPage />} />
                <Route path="/referral"  element={<ProtectedRoute><AppLayout><ReferralPage /></AppLayout></ProtectedRoute>} />
                <Route path="/cart"      element={<PublicLayout><CartPage /></PublicLayout>} />
                <Route path="/checkout"  element={<ProtectedRoute><PublicLayout><CheckoutPage /></PublicLayout></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><PublicLayout><OrderSuccessPage /></PublicLayout></ProtectedRoute>} />
                <Route path="/dashboard"         element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
                <Route path="/dashboard/orders"  element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
                <Route path="/dashboard/profile" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
                <Route path="/admin"        element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
                <Route path="/admin/leads"  element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
                <Route path="/admin/users"  element={<AdminRoute><AppLayout><AdminPage /></AppLayout></AdminRoute>} />
                <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}