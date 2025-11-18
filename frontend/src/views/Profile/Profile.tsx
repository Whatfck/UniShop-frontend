import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { ProductGrid } from '../../components/features/product';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, User as UserType } from '../../types';
import { apiService } from '../../services/api';
import { transformApiProduct, generateRandomAvatar } from '../../utils/apiTransformers';
import { Calendar, Package } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // 12 productos por página para perfil
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hasProductsForSale, setHasProductsForSale] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll get user info from products since we don't have a dedicated user endpoint
      // TODO: Implement proper user profile endpoint
      const allProducts = await apiService.getProducts();
      const userProductsData = allProducts.filter(product => String(product.userId) === userId);

      let profileUserData: UserType;
      let transformedProducts: Product[] = [];

      if (userProductsData.length > 0) {
        // Create user profile from first product data
        const firstProduct = userProductsData[0];
        profileUserData = {
          id: firstProduct.userId,
          name: firstProduct.userName,
          email: '', // Not available from product data
          avatar: generateRandomAvatar(firstProduct.userId), // Generate avatar for users with products
          role: 'USER',
          phoneVerified: false, // Not available from product data
          createdAt: new Date(), // Not available from product data
        };
        transformedProducts = userProductsData.map(transformApiProduct);
      } else {
        // Create a basic user profile for users without products
        profileUserData = {
          id: userId,
          name: `Usuario ${userId}`, // Placeholder name
          email: '',
          avatar: generateRandomAvatar(userId), // Generate avatar for users without products
          role: 'USER',
          phoneVerified: false,
          createdAt: new Date(),
        };
      }

      setProfileUser(profileUserData);
      setUserProducts(transformedProducts);
      setHasProductsForSale(transformedProducts.length > 0);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Error al cargar el perfil del usuario. Verifica que el backend esté ejecutándose.');
      setProfileUser(null);
      setUserProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  // Check if current user has products for sale when authenticated
  useEffect(() => {
    const checkUserProducts = async () => {
      if (isAuthenticated && user) {
        try {
          const allProducts = await apiService.getProducts();
          const currentUserProducts = allProducts.filter(product => String(product.userId) === user.id);
          setHasProductsForSale(currentUserProducts.length > 0);
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

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/product/${product.id}`);
    }
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
      // Open WhatsApp or contact modal
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

  if (isLoading) {
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
        <main className="max-w-full mx-auto py-16 px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-[var(--color-border)] rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-[var(--color-border)] rounded w-48 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profileUser) {
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
        <main className="max-w-full mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {error || 'Usuario no encontrado'}
            </h1>
          </div>
        </main>
      </div>
    );
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
        onLogoutClick={handleLogoutClick}
      />

      {/* Profile Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-full mx-auto py-12 px-4" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-[var(--color-border)] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {profileUser.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {profileUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left self-center">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {profileUser.name}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Calendar className="w-4 h-4" />
                  <span>Miembro desde {profileUser.createdAt.getFullYear()}</span>
                </div>

                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Package className="w-4 h-4" />
                  <span>{userProducts.length} productos publicados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Productos de {profileUser.name}
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {userProducts.length} productos disponibles
          </p>
        </div>

        {userProducts.length > 0 ? (
          <ProductGrid
            products={currentProducts}
            isLoading={false}
            onProductClick={handleProductClick}
            onFavoriteToggle={handleFavoriteToggle}
            onContact={handleContact}
            showContactButton={false}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              No hay productos publicados aún
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {profileUser.name} aún no ha publicado ningún producto.
            </p>
            {isAuthenticated && user?.id === profileUser.id && (
              <button
                onClick={handleSellClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
              >
                <Package className="w-4 h-4" />
                Publicar mi primer producto
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && userProducts.length > 0 && (
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

export default Profile;