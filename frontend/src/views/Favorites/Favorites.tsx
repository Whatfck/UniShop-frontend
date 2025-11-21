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
import { Heart } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchFavoriteProducts = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // First get favorite product IDs
      const favoriteIds = await apiService.getFavoriteIds();
      console.log('Favorite IDs received:', favoriteIds);

      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        return;
      }

      // Then get full product details for each favorite
      const productPromises = favoriteIds.map(id => apiService.getProduct(id));
      const apiProducts = await Promise.all(productPromises);
      console.log('Favorite products received:', apiProducts);

      const transformedFavorites = apiProducts.map(product => ({
        ...transformApiProduct(product),
        isFavorited: true
      }));

      setFavoriteProducts(transformedFavorites);
    } catch (err) {
      console.error('Error fetching favorite products:', err);
      setError('Error al cargar tus favoritos. Verifica que el backend esté ejecutándose.');
      setFavoriteProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteProducts();
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleProductClick = (product: Product) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleFavoriteToggle = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await apiService.toggleFavorite(Number(productId));
      // If no longer favorited, remove from favorites list
      if (!response.isFavorited) {
        setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleContact = async (product: Product) => {
    try {
      await apiService.recordContact(Number(product.id));
      console.log('Contact recorded for product:', product.id);
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
    console.log('Navigate to sell product page');
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
  const totalPages = Math.ceil(favoriteProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = favoriteProducts.slice(startIndex, endIndex);

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
        hasProductsForSale={false}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
        onSellClick={handleSellClick}
        onDashboardClick={handleDashboardClick}
        onLogoutClick={handleLogoutClick}
      />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Mis Favoritos
              </h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              ← Volver al Dashboard
            </button>
          </div>

          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto favorito' : 'productos favoritos'}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Aún no has agregado productos a favoritos
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Explora productos y guarda los que te interesen para verlos aquí.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
            >
              Explorar Productos
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
              showContactButton={true}
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

export default Favorites;