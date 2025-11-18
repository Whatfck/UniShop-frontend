import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { FilterPanel } from '../../components/features/search';
import { ProductGrid } from '../../components/features/product';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, ProductFilters } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct, transformFiltersToApi } from '../../utils/apiTransformers';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20; // 20 productos por página (4 filas x 5 columnas)
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

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
      setError('Error al cargar los productos. Verifica que el backend esté ejecutándose.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('query') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    // Initialize filters from URL params
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const datePosted = searchParams.get('datePosted');
    const initialFilters: ProductFilters = {};
    if (categoryId) initialFilters.categoryId = parseInt(categoryId);
    if (minPrice) initialFilters.priceMin = parseInt(minPrice);
    if (maxPrice) initialFilters.priceMax = parseInt(maxPrice);
    if (condition && (condition === 'new' || condition === 'used')) initialFilters.condition = condition;
    if (datePosted && (datePosted === 'today' || datePosted === 'week' || datePosted === 'month')) initialFilters.datePosted = datePosted;
    setFilters(initialFilters);
  }, [searchParams]);

  useEffect(() => {
    const query = searchParams.get('query') || '';
    fetchProducts(query, filters);
  }, [searchParams, filters]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();
    navigate(`/search${query ? '?query=' + encodeURIComponent(query) : ''}`);
  };

  const formatSearchDescription = (params: URLSearchParams, currentFilters: ProductFilters): string => {
    const parts: string[] = [];
    const query = params.get('query');
    if (query) {
      parts.push(`"${query}"`);
    }
    if (currentFilters.categoryId) {
      const categories = ['Libros', 'Tecnología', 'Material de Laboratorio', 'Arquitectura', 'Útiles Escolares', 'Otros'];
      parts.push(`Categoría: ${categories[currentFilters.categoryId - 1] || 'Desconocida'}`);
    }
    if (currentFilters.condition) {
      parts.push(`Condición: ${currentFilters.condition === 'new' ? 'Nuevo' : 'Usado'}`);
    }
    if (currentFilters.priceMin || currentFilters.priceMax) {
      const min = currentFilters.priceMin ? `$${currentFilters.priceMin.toLocaleString()}` : '';
      const max = currentFilters.priceMax ? `$${currentFilters.priceMax.toLocaleString()}` : '';
      parts.push(`Precio: ${min}${min && max ? '-' : ''}${max}`);
    }
    if (currentFilters.datePosted) {
      const dateLabels = { today: 'Hoy', week: 'Esta semana', month: 'Este mes' };
      parts.push(`Publicado: ${dateLabels[currentFilters.datePosted]}`);
    }
    return parts.length > 0 ? parts.join(' - ') : 'todos los productos';
  };

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    if (!isAuthenticated) {
      setPendingProductId(product.id);
      setShowLoginModal(true);
    } else {
      // Navigate to product detail
      window.location.href = `/product/${product.id}`;
    }
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

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
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
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Resultados de búsqueda
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Buscando: {formatSearchDescription(searchParams, filters)}
              </p>
            </div>
            <ProductGrid
              products={currentProducts}
              isLoading={isLoading}
              onProductClick={handleProductClick}
              onFavoriteToggle={handleFavoriteToggle}
              onContact={handleContact}
              showContactButton={!isAuthenticated}
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
          </div>
        </div>
      </main>

      <Footer />

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

export default Search;