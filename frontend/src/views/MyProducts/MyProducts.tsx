import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { ProductGrid } from '../../components/features/product';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct } from '../../utils/apiTransformers';
import { ArrowLeft, Package, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

const MyProducts = () => {
  const navigate = useNavigate();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { user, isAuthenticated } = useAuth();
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleSellClick = () => {
    // TODO: Navigate to sell product page
    console.log('Navigate to sell product page');
  };

  const handleBackClick = () => {
    navigate('/dashboard');
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

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        onSearchSubmit={() => {}}
        isAuthenticated={isAuthenticated}
        user={user || undefined}
        hasProductsForSale={userProducts.length > 0}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        onLoginClick={() => {}}
        onRegisterClick={() => {}}
        onSellClick={handleSellClick}
        onDashboardClick={() => navigate('/dashboard')}
        onLogoutClick={() => {}}
      />

      {/* Page Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-full mx-auto py-8 px-4" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Mis Productos
                </h1>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  Gestiona todos tus productos publicados
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {userProducts.length} producto{userProducts.length !== 1 ? 's' : ''} publicado{userProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              onClick={handleSellClick}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publicar Producto
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {userProducts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Aún no has publicado productos
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              ¡Comienza a vender publicando tu primer producto!
            </p>
            <Button
              onClick={handleSellClick}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Publicar Mi Primer Producto
            </Button>
          </div>
        ) : (
          <>
            <ProductGrid
              products={currentProducts}
              isLoading={isLoading}
              onProductClick={handleProductClick}
              onFavoriteToggle={() => {}}
              onContact={() => {}}
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
      </main>

      <Footer />
    </div>
  );
};

export default MyProducts;