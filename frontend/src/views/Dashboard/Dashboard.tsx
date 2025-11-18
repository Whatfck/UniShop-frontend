import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { ProductGrid } from '../../components/features/product';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct } from '../../utils/apiTransformers';
import { User, Package, Eye, Heart, TrendingUp, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hasProductsForSale, setHasProductsForSale] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const fetchUserProducts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const allProducts = await apiService.getProducts();
      const userProductsData = allProducts.filter(product => String(product.userId) === user.id);
      const transformedProducts = userProductsData.map(transformApiProduct);

      setUserProducts(transformedProducts);
      setHasProductsForSale(transformedProducts.length > 0);
    } catch (err) {
      console.error('Error fetching user products:', err);
      setError('Error al cargar tus productos. Verifica que el backend esté ejecutándose.');
      setUserProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProducts();
    }
  }, [isAuthenticated, user]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteToggle = (productId: string) => {
    setUserProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isFavorited: !product.isFavorited }
        : product
    ));
  };

  const handleContact = async (product: Product) => {
    try {
      await apiService.recordContact(Number(product.id));
      console.log('Contact recorded for product:', product.id);
      // TODO: Implement WhatsApp integration
    } catch (err) {
      console.error('Error recording contact:', err);
    }
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
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };


  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleHeaderSearchChange = (query: string) => {
    setHeaderSearchQuery(query);
  };

  const handleHeaderSearchSubmit = () => {
    const query = headerSearchQuery.trim();
    navigate(`/search${query ? '?query=' + encodeURIComponent(query) : ''}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(userProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = userProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Calculate statistics
  const totalViews = 0; // TODO: Implement when backend provides view counts
  const totalFavorites = 0; // TODO: Implement when backend provides favorite counts

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery={headerSearchQuery}
        onSearchChange={handleHeaderSearchChange}
        onSearchSubmit={handleHeaderSearchSubmit}
        isAuthenticated={isAuthenticated}
        user={user || undefined}
        hasProductsForSale={hasProductsForSale}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
        onSellClick={handleSellClick}
        onDashboardClick={handleDashboardClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Dashboard Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-full mx-auto py-12 px-4" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-[var(--color-border)] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left self-center">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                ¡Hola, {user?.name}!
              </h1>
              <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Bienvenido a tu panel de control
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={handleSellClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Publicar Producto
                </button>
                <button
                  onClick={handleProfileClick}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <User className="w-4 h-4" />
                  Ver Perfil Público
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {userProducts.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Productos
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {totalViews}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Vistas
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {totalFavorites}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Favoritos
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <div className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {userProducts.length > 0 ? Math.round(totalViews / userProducts.length) : 0}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Promedio
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Mis Productos
            </h2>
            <button
              onClick={handleSellClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button>
          </div>

          {userProducts.length === 0 ? (
            <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Aún no has publicado productos
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                ¡Comienza a vender publicando tu primer producto!
              </p>
              <button
                onClick={handleSellClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Publicar Mi Primer Producto
              </button>
            </div>
          ) : (
            <>
              <ProductGrid
                products={currentProducts}
                isLoading={isLoading}
                onProductClick={handleProductClick}
                onFavoriteToggle={handleFavoriteToggle}
                onContact={handleContact}
                showContactButton={false}
                isAuthenticated={isAuthenticated}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-[var(--color-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)] transition-colors"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Anterior
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 border rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                              : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                          }`}
                          style={{ color: currentPage === pageNum ? 'white' : 'var(--color-text-primary)' }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-[var(--color-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)] transition-colors"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
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

export default Dashboard;