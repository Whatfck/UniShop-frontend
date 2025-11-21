import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, ArrowUp, SortAsc } from 'lucide-react';
import { Header, Footer } from '../../components/layout';
import { HeroSection } from '../../components/features/home';
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
import { transformApiProduct } from '../../utils/apiTransformers';

const Home = () => {
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
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
  const [hasProductsForSale, setHasProductsForSale] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high'>('newest');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { resolvedTheme } = useTheme();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiProducts = await apiService.getProducts();
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
    fetchProducts();
  }, [isAuthenticated, user]);

  // Check if user has products for sale when authenticated
  useEffect(() => {
    const checkUserProducts = async () => {
      if (isAuthenticated && user) {
        try {
          // For now, check if user has any products by filtering products
          // TODO: Implement proper user products endpoint
          const allProducts = await apiService.getProducts();
          const userProducts = allProducts.filter(product => product.userId === user.id);
          setHasProductsForSale(userProducts.length > 0);
        } catch (error) {
          console.error('Error checking user products:', error);
          setHasProductsForSale(false);
        }
      } else {
        setHasProductsForSale(false);
      }
    };

    checkUserProducts();
  }, [isAuthenticated, user]);

  // Redirigir al producto pendiente después de autenticarse
  useEffect(() => {
    if (isAuthenticated && pendingProductId) {
      navigate(`/product/${pendingProductId}`);
      setPendingProductId(null); // Limpiar el estado
      setShowLoginModal(false); // Cerrar modal
    }
  }, [isAuthenticated, pendingProductId, navigate]);

  // Handle scroll for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    if (!isAuthenticated) {
      // Si no está autenticado, guardar producto pendiente y mostrar modal de login
      setPendingProductId(product.id);
      setShowLoginModal(true);
    } else {
      // Si está autenticado, ir al detalle del producto
      navigate(`/product/${product.id}`);
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
      // Open WhatsApp or contact modal
      // TODO: Implement WhatsApp integration
    } catch (err) {
      console.error('Error recording contact:', err);
    }
  };

  const handleStartShopping = () => {
    // Scroll to just after the hero section
    window.scrollTo({ top: window.innerHeight - 40, behavior: 'smooth' });
  };

  const handleSellProduct = () => {
    // Scroll to top and trigger registration
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowRegisterModal(true);
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

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    // Build URL params for filters
    const params = new URLSearchParams();
    if (newFilters.categoryId) params.set('categoryId', newFilters.categoryId.toString());
    if (newFilters.priceMin) params.set('minPrice', newFilters.priceMin.toString());
    if (newFilters.priceMax) params.set('maxPrice', newFilters.priceMax.toString());
    if (newFilters.condition) params.set('condition', newFilters.condition);
    if (newFilters.datePosted) params.set('datePosted', newFilters.datePosted);
    const paramString = params.toString();
  };

  const handleSortChange = (newSortBy: 'newest' | 'oldest' | 'price-low' | 'price-high') => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Pagination logic - only for authenticated users
  const totalPages = isAuthenticated ? Math.ceil(filteredProducts.length / productsPerPage) : 1;
  const startIndex = isAuthenticated ? (currentPage - 1) * productsPerPage : 0;
  const endIndex = isAuthenticated ? startIndex + productsPerPage : productsPerPage;
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

  // Generate pagination pages with ellipsis for large page counts
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show around current page

    // Always show first page
    if (1 < currentPage - delta) {
      pages.push(1);
      if (2 < currentPage - delta) {
        pages.push('...');
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }

    // Always show last page
    if (totalPages > currentPage + delta) {
      if (totalPages - 1 > currentPage + delta) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery={headerSearchQuery}
        onSearchChange={handleHeaderSearchChange}
        onSearchSubmit={handleHeaderSearchSubmit}
        isAuthenticated={isAuthenticated}
        user={user || undefined}
        hasProductsForSale={hasProductsForSale}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
        onSellClick={handleSellClick}
        onDashboardClick={handleDashboardClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Hero Section - Solo para usuarios no autenticados */}
      {!isAuthenticated && (
        <HeroSection
          onStartShopping={handleStartShopping}
          onSellProduct={handleSellProduct}
          isAuthenticated={isAuthenticated}
        />
      )}

      <main className="max-w-full mx-auto py-4" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        {isAuthenticated ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Panel - Only for authenticated users - Hidden on mobile */}
            <aside className="hidden lg:block w-full lg:w-80 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
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
                showContactButton={false}
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
                      {getPaginationPages().map((page, index) => {
                        if (page === '...') {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-[var(--color-text-secondary)]"
                            >
                              ...
                            </span>
                          );
                        }

                        const pageNum = page as number;
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
        ) : (
          <div>
            <div className="mb-2 text-center">
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Productos Destacados
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Inicia sesión para acceder a todos los productos, filtros avanzados y opciones de ordenamiento
              </p>
            </div>


            <ProductGrid
              products={currentProducts}
              isLoading={isLoading}
              onProductClick={handleProductClick}
              onFavoriteToggle={handleFavoriteToggle}
              onContact={handleContact}
              showContactButton={true}
              isAuthenticated={isAuthenticated}
            />

          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors z-40"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

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