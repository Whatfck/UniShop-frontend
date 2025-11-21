import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, SortAsc } from 'lucide-react';
import { Header, Footer } from '../../components/layout';
import { FilterPanel } from '../../components/features/search';
import { ProductGrid } from '../../components/features/product';
import { Button } from '../../components/ui';
import Modal from '../../components/ui/Modal';
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
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high'>('newest');
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async (search?: string, filters?: ProductFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const apiFilters = transformFiltersToApi({
        ...filters,
        search,
      });

      const apiProducts = await apiService.getProducts(apiFilters);
      let transformedProducts = apiProducts.map(transformApiProduct);

      // If user is authenticated, check which products are favorited
      if (isAuthenticated && user) {
        try {
          const favoriteIds = await apiService.getFavoriteIds();
          const favoriteIdSet = new Set(favoriteIds.map(id => String(id)));
          transformedProducts = transformedProducts.map(product => ({
            ...product,
            isFavorited: favoriteIdSet.has(String(product.id))
          }));
        } catch (favError) {
          console.error('Error fetching favorites:', favError);
          // Continue without favorites if there's an error
        }
      }

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

  const handleSortChange = (newSortBy: 'newest' | 'oldest' | 'price-low' | 'price-high') => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
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

  const handleFavoriteToggle = async (productId: string) => {
    console.log('Toggling favorite for product:', productId);
    try {
      const response = await apiService.toggleFavorite(Number(productId));
      console.log('Toggle favorite response:', response);

      // Update local state - ensure we're creating a new array and new objects
      setProducts(prevProducts => {
        return prevProducts.map(product => {
          if (String(product.id) === String(productId)) {
            const newIsFavorited = !product.isFavorited;
            console.log(`Product ${productId} favorite status changed from ${product.isFavorited} to ${newIsFavorited}`);
            return {
              ...product,
              isFavorited: newIsFavorited
            };
          }
          return product;
        });
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // TODO: Show error toast
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

  // Filter and sort products based on current filters and sort options
  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.categoryId && product.category !== filters.categoryId.toString()) {
        return false;
      }

      // Price filters
      if (filters.priceMin && product.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && product.price > filters.priceMax) {
        return false;
      }

      // Condition filter
      if (filters.condition && product.condition !== filters.condition) {
        return false;
      }

      // Date posted filter
      if (filters.datePosted) {
        const now = new Date();
        const productDate = new Date(product.createdAt);
        const diffTime = now.getTime() - productDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        switch (filters.datePosted) {
          case 'today':
            if (diffDays > 1) return false;
            break;
          case 'week':
            if (diffDays > 7) return false;
            break;
          case 'month':
            if (diffDays > 30) return false;
            break;
        }
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Get filtered and sorted products
  const filteredProducts = getFilteredAndSortedProducts();

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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

            {/* Mobile Controls */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowFiltersModal(true)}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button
                  onClick={() => setShowSortModal(true)}
                  className="flex-1 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <SortAsc className="h-4 w-4" />
                  Ordenar
                </Button>
              </div>
            </div>

            {/* Sort Controls - Desktop Only */}
            <div className="hidden lg:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Ordenar por:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest' | 'price-low' | 'price-high')}
                  className="px-3 py-1 border border-[var(--color-border)] rounded-md text-sm bg-[var(--color-surface)]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                </select>
              </div>

              {/* Results count */}
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </div>
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
              <div className="mt-8">
                <div className="text-center mb-4">
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Página {currentPage} de {totalPages} • {filteredProducts.length} productos encontrados
                  </p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-[var(--color-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)] transition-colors flex items-center gap-1"
                    style={{ color: 'var(--color-text-primary)' }}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                    className="px-3 py-2 border border-[var(--color-border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface)] transition-colors flex items-center gap-1"
                    style={{ color: 'var(--color-text-primary)' }}
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Filters Modal for Mobile */}
      <Modal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title="Filtros"
      >
        <div className="p-4">
          <FilterPanel
            filters={filters}
            onFiltersChange={(newFilters) => {
              handleFiltersChange(newFilters);
              setShowFiltersModal(false); // Close modal after applying filters
            }}
          />
        </div>
      </Modal>

      {/* Sort Modal for Mobile */}
      <Modal
        isOpen={showSortModal}
        onClose={() => setShowSortModal(false)}
        title="Ordenar por"
      >
        <div className="p-4">
          <div className="space-y-3">
            {[
              { value: 'newest', label: 'Más recientes' },
              { value: 'oldest', label: 'Más antiguos' },
              { value: 'price-low', label: 'Precio: menor a mayor' },
              { value: 'price-high', label: 'Precio: mayor a menor' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleSortChange(option.value as 'newest' | 'oldest' | 'price-low' | 'price-high');
                  setShowSortModal(false);
                }}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  sortBy === option.value
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'
                }`}
                style={{
                  color: sortBy === option.value ? 'white' : 'var(--color-text-primary)'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>

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