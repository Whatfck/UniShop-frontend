import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { ProductGrid } from '../../components/features/product';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import CreateProductModal from '../../components/CreateProductModal';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct } from '../../utils/apiTransformers';
import { User, Package, Eye, Heart, TrendingUp, Plus, Edit, Sun, Moon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const productsPerPage = 12;
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [hasProductsForSale, setHasProductsForSale] = useState(false);
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

      // Mark products that are in favorites
      const favoriteIds = new Set(favoriteProducts.map(fav => fav.id));
      const productsWithFavorites = transformedProducts.map(product => ({
        ...product,
        isFavorited: favoriteIds.has(product.id)
      }));

      setUserProducts(productsWithFavorites);
      setHasProductsForSale(transformedProducts.length > 0);
    } catch (err) {
      console.error('Error fetching user products:', err);
      setError('Error al cargar tus productos. Verifica que el backend esté ejecutándose.');
      setUserProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoriteProducts = async () => {
    try {
      setIsLoadingFavorites(true);
      // First get favorite product IDs
      const favoriteIds = await apiService.getFavoriteIds();
      console.log('Dashboard - Favorite IDs received:', favoriteIds);

      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        return;
      }

      // Then get full product details for each favorite
      const productPromises = favoriteIds.map(id => apiService.getProduct(id));
      const apiProducts = await Promise.all(productPromises);
      console.log('Dashboard - Favorite products received:', apiProducts);

      const transformedFavorites = apiProducts.map(product => ({
        ...transformApiProduct(product),
        isFavorited: true // Mark as favorited since they come from favorites endpoint
      }));

      setFavoriteProducts(transformedFavorites);
    } catch (err) {
      console.error('Error fetching favorite products:', err);
      setFavoriteProducts([]);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFavoriteProducts();
    }
  }, [isAuthenticated, user]);

  // Fetch user products after favorites are loaded
  useEffect(() => {
    if (isAuthenticated && user && !isLoadingFavorites) {
      fetchUserProducts();
    }
  }, [isAuthenticated, user, isLoadingFavorites, favoriteProducts]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteToggle = async (productId: string) => {
    try {
      await apiService.toggleFavorite(Number(productId));
      // Update both user products and favorites lists
      setUserProducts(prev => prev.map(product =>
        product.id === productId
          ? { ...product, isFavorited: !product.isFavorited }
          : product
      ));
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // TODO: Show error toast
    }
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
    setShowCreateProductModal(true);
  };

  const handleProductCreated = () => {
    // Refresh user products after creating a new one
    fetchUserProducts();
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
  const totalFavorites = favoriteProducts.length;

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
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  ¡Hola, {user?.name}!
                </h1>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors text-sm font-medium"
                  title="Editar perfil"
                >
                  <Edit className="w-4 h-4" />
                  Editar perfil
                </button>
              </div>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Bienvenido a tu panel de control
              </p>
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleSellClick}
                className="inline-flex items-center justify-center hover:bg-[var(--color-surface)] rounded transition-colors p-1"
                aria-label="Agregar Producto"
              >
                <Plus className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </button>
              <button
                onClick={() => navigate('/my-products')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <Package className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                Ver todo
              </button>
            </div>
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

        {/* Favorites Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Mis Favoritos
            </h2>
            <button
              onClick={() => navigate('/favorites')}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface)] transition-colors font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <Heart className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              Ver todo
            </button>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
              <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Aún no has agregado productos a favoritos
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
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
                products={favoriteProducts.slice(0, 12)}
                isLoading={isLoadingFavorites}
                onProductClick={handleProductClick}
                onFavoriteToggle={handleFavoriteToggle}
                onContact={handleContact}
                showContactButton={true}
                isAuthenticated={isAuthenticated}
              />
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

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Editar Perfil
              </h2>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get('name') as string;
                const profileImageFile = formData.get('profileImage') as File;

                try {
                  let profileImageUrl = user?.avatar;

                  // Upload new profile image if provided
                  if (profileImageFile && profileImageFile.size > 0) {
                    const uploadResult = await apiService.uploadProfileImage(profileImageFile);
                    profileImageUrl = uploadResult.url;
                  }

                  // Update profile
                  if (user?.id) {
                    await apiService.updateUserProfile(user.id, {
                      name: name || user.name,
                      profileImage: profileImageUrl
                    });

                    // Update local user state (you might need to update the auth context)
                    // For now, just close the modal
                    setShowEditProfileModal(false);
                    // You might want to refresh the page or update the user context
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Error updating profile:', error);
                  // TODO: Show error message
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      Foto de Perfil
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                    </p>
                  </div>

                  {/* Theme Toggle Section */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                      Preferencias de Tema
                    </label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {resolvedTheme === 'light' ? (
                            <Moon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          ) : (
                            <Sun className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          )}
                          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {resolvedTheme === 'light' ? 'Tema Oscuro' : 'Tema Claro'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Cambiar a {resolvedTheme === 'light' ? 'oscuro' : 'claro'}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;