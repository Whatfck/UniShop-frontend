import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, MapPin, Clock, Share2, Flag } from 'lucide-react';
import { Header } from '../../components/layout';
import { Button } from '../../components/ui';
import { useTheme } from '../../hooks';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { transformApiProduct } from '../../utils/apiTransformers';
import LoginModal from '../../components/auth/LoginModal';
import RegisterModal from '../../components/auth/RegisterModal';
import type { Product } from '../../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Advanced image carousel state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showZoomHint, setShowZoomHint] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const apiProduct = await apiService.getProduct(Number(id));
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);
        setIsFavorited(transformedProduct.isFavorited || false);
      } catch (apiError) {
        console.error('Error fetching product:', apiError);
        setError('Error al cargar el producto. Verifica que el backend esté ejecutándose.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Reset zoom when changing images
  useEffect(() => {
    resetZoom();
  }, [currentImageIndex]);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement API call to toggle favorite
  };

  const handleContact = async () => {
    if (!product) return;

    try {
      // Record contact in backend
      await apiService.recordContact(Number(product.id));

      // Open WhatsApp
      const message = `Hola! Me interesa tu producto "${product.title}" que vi en UniShop. ¿Aún está disponible?`;
      const whatsappUrl = `https://wa.me/57${product.seller.phoneVerified ? '3001234567' : '3001234567'}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error recording contact:', error);
      // Still open WhatsApp even if recording fails
      const message = `Hola! Me interesa tu producto "${product.title}" que vi en UniShop. ¿Aún está disponible?`;
      const whatsappUrl = `https://wa.me/57${product.seller.phoneVerified ? '3001234567' : '3001234567'}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Mira este producto en UniShop: ${product?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Report product:', product?.id);
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

  // Advanced gesture handlers
  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setIsZoomed(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (zoom > 1) {
      resetZoom();
    } else {
      // Zoom to 2x at click position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setZoom(2);
      setPanX((rect.width / 2 - x) * 2);
      setPanY((rect.height / 2 - y) * 2);
      setIsZoomed(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZoomed) {
      // Pan mode when zoomed
      setIsDragging(true);
      setStartX(e.clientX - panX);
    } else {
      // Swipe mode when not zoomed
      setIsDragging(true);
      setStartX(e.clientX);
      setDragDistance(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    if (isZoomed) {
      // Pan the zoomed image
      const newPanX = e.clientX - startX;
      const newPanY = e.clientY - (startX + panY - panX); // Maintain aspect ratio

      // Constrain pan to image bounds
      const maxPanX = (zoom - 1) * 200; // Assuming 200px base width
      const maxPanY = (zoom - 1) * 200;

      setPanX(Math.max(-maxPanX, Math.min(maxPanX, newPanX)));
      setPanY(Math.max(-maxPanY, Math.min(maxPanY, newPanY)));
    } else {
      // Show drag preview
      const currentX = e.clientX;
      setDragDistance(currentX - startX);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !product) return;

    if (!isZoomed) {
      // Handle swipe to change image
      const threshold = 100;

      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0 && currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        } else if (dragDistance < 0 && currentImageIndex < product.images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    }

    setIsDragging(false);
    setDragDistance(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setShowZoomHint(false);
  };

  const handleMouseEnter = () => {
    if (!isZoomed && zoom === 1) {
      setShowZoomHint(true);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    // Check for double tap
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      handleDoubleTap(touch);
      setLastTapTime(0);
      return;
    }
    setLastTapTime(currentTime);

    if (e.touches.length === 2) {
      // Pinch start
      handlePinchStart(e);
    } else if (isZoomed) {
      // Pan start
      setIsDragging(true);
      setStartX(touch.clientX - panX);
    } else {
      // Swipe start
      setIsDragging(true);
      setStartX(touch.clientX);
      setDragDistance(0);
    }
  };

  const handleDoubleTap = (touch: React.Touch) => {
    if (zoom > 1) {
      resetZoom();
    } else {
      // Zoom to 2x at touch position
      const rect = (touch.target as HTMLElement).getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setZoom(2);
      setPanX((rect.width / 2 - x) * 2);
      setPanY((rect.height / 2 - y) * 2);
      setIsZoomed(true);
    }
  };

  const handlePinchStart = (e: React.TouchEvent) => {
    // Basic pinch implementation
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const initialDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    (e.currentTarget as any).initialDistance = initialDistance;
    (e.currentTarget as any).initialZoom = zoom;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Handle pinch
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      const element = e.currentTarget as any;
      const newZoom = Math.max(1, Math.min(4, element.initialZoom * (distance / element.initialDistance)));
      setZoom(newZoom);
      setIsZoomed(newZoom > 1);
    } else if (isDragging) {
      if (isZoomed) {
        // Pan
        const touch = e.touches[0];
        const newPanX = touch.clientX - startX;
        const newPanY = touch.clientY - (startX + panY - panX);

        const maxPanX = (zoom - 1) * 200;
        const maxPanY = (zoom - 1) * 200;

        setPanX(Math.max(-maxPanX, Math.min(maxPanX, newPanX)));
        setPanY(Math.max(-maxPanY, Math.min(maxPanY, newPanY)));
      } else {
        // Swipe preview
        const touch = e.touches[0];
        setDragDistance(touch.clientX - startX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !product) return;

    if (!isZoomed) {
      const threshold = 100;

      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0 && currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        } else if (dragDistance < 0 && currentImageIndex < product.images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    }

    setIsDragging(false);
    setDragDistance(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoom === 1 && product) { // Only allow navigation when not zoomed
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight' && currentImageIndex < product.images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, product, zoom]);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          theme={theme}
          resolvedTheme={resolvedTheme}
          onThemeToggle={toggleTheme}
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

  if (error || !product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          theme={theme}
          resolvedTheme={resolvedTheme}
          onThemeToggle={toggleTheme}
        />
        <main className="max-w-full mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {error || 'Producto no encontrado'}
            </h1>
            <Button onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Si no está autenticado, mostrar modal de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          theme={theme}
          resolvedTheme={resolvedTheme}
          onThemeToggle={toggleTheme}
          onLoginClick={handleLogin}
          onRegisterClick={handleRegister}
        />

        <main className="max-w-full mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Debes iniciar sesión para ver los detalles del producto
            </h1>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Regístrate o inicia sesión para explorar todos los productos disponibles.
            </p>
            <Button onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          </div>
        </main>

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
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        isAuthenticated={isAuthenticated}
        user={user || undefined}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onThemeToggle={toggleTheme}
        onLoginClick={handleLogin}
        onRegisterClick={handleRegister}
        onSellClick={handleSellClick}
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
      />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Advanced Image Viewer */}
            <div
              className={`relative aspect-square rounded-xl overflow-hidden bg-[var(--color-border)] select-none ${
                isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              onDoubleClick={handleDoubleClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="img"
              aria-label={`Imagen del producto ${product.title}. ${isZoomed ? 'Ampliada' : 'Haz doble clic para ampliar'}. Imagen ${currentImageIndex + 1} de ${product.images.length}`}
              tabIndex={0}
              style={{
                touchAction: isZoomed ? 'none' : 'pan-y pinch-zoom'
              }}
            >
              <div
                className="w-full h-full transition-transform duration-300 ease-out"
                style={{
                  transform: isDragging && !isZoomed
                    ? `translateX(${dragDistance * 0.3}px)`
                    : `scale(${zoom}) translate(${panX}px, ${panY}px)`,
                  transformOrigin: 'center center',
                  cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
                }}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.title} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                  draggable={false}
                />
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white z-20"
                aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </Button>

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Zoom Indicator */}
              {zoom > 1 && (
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                  {zoom.toFixed(1)}× Zoom
                </div>
              )}

              {/* Zoom Hint */}
              {showZoomHint && !isZoomed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                    🔍 Doble clic para hacer zoom
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {product.title}
              </h1>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                ${product.price.toLocaleString()}
              </p>
            </div>

            {/* Condition and Location */}
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.condition === 'new'
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-[var(--color-border)] text-[var(--color-text-primary)]'
              }`}>
                {product.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Hace {Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))} días</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Descripción
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }} className="leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Information */}
            <div className="border border-[var(--color-border)] rounded-lg p-4">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Información del vendedor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-border)] flex items-center justify-center">
                  {product.seller.avatar ? (
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {product.seller.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {product.seller.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Miembro desde {new Date(product.seller.memberSince).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                fullWidth
                onClick={handleContact}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReport}
                  className="flex items-center gap-2"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--color-border)] rounded-full text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

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

export default ProductDetail;