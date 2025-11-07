import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { HeroSection } from '../../components/features/home';
import { FilterPanel } from '../../components/features/search';
import { ProductGrid } from '../../components/features/product';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, ProductFilters } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct, transformFiltersToApi } from '../../utils/apiTransformers';

import { mockProducts } from '../../data/mockProducts';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const fetchProducts = async (search?: string, filters?: ProductFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const apiFilters = transformFiltersToApi({
        ...filters,
        search,
      });

      const apiProducts = await apiService.getProducts(apiFilters);
      const transformedProducts = apiProducts.map(transformApiProduct);

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos. Mostrando datos de ejemplo.');
      // Fallback to mock data
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(query, filters);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    fetchProducts(searchQuery, newFilters);
  };

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteToggle = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isFavorited: !product.isFavorited }
        : product
    ));
  };

  const handleContact = async (product: Product) => {
    try {
      await apiService.recordContact(Number(product.id));
      console.log('Contact recorded for product:', product.id);
      // Open WhatsApp or contact modal
      // TODO: Implement WhatsApp integration
    } catch (err) {
      console.error('Error recording contact:', err);
    }
  };

  const handleStartShopping = () => {
    // Scroll to products section
    const productsSection = document.querySelector('main');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSellProduct = () => {
    // Scroll to top and trigger registration
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // TODO: Open registration modal
    console.log('Open registration for selling products');
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSellClick = () => {
    // TODO: Navigate to sell product page
    console.log('Navigate to sell product page');
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page
    console.log('Navigate to profile page');
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        isAuthenticated={isAuthenticated}
        user={user || undefined}
        theme={theme}
        onThemeToggle={toggleTheme}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
        onSellClick={handleSellClick}
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Hero Section */}
      <HeroSection
        onStartShopping={handleStartShopping}
        onSellProduct={handleSellProduct}
        isAuthenticated={isAuthenticated}
      />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel - Only show if authenticated */}
          {isAuthenticated && (
            <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </aside>
          )}

          {/* Products Grid */}
          <div className={`${isAuthenticated ? 'flex-1 order-1 lg:order-2' : 'w-full'}`}>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onProductClick={handleProductClick}
              onFavoriteToggle={handleFavoriteToggle}
              onContact={handleContact}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default Home;