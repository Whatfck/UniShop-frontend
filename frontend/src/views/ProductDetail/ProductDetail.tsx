import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, MapPin, Clock, Star, Share2, Flag } from 'lucide-react';
import { Header } from '../../components/layout';
import { Button } from '../../components/ui';
import { useTheme } from '../../hooks';
import { mockProducts, getProductById } from '../../data/mockProducts';
import { apiService } from '../../services/api';
import { transformApiProduct } from '../../utils/apiTransformers';
import type { Product } from '../../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from API first
        const apiProduct = await apiService.getProduct(Number(id));
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);
        setIsFavorited(transformedProduct.isFavorited || false);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);

        // Fallback to mock data
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          setIsFavorited(foundProduct.isFavorited || false);
        } else {
          setError('Producto no encontrado');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header
          searchQuery=""
          onSearchChange={() => {}}
          theme={theme}
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-border)]">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
                aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </Button>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {product.seller.rating} • Miembro desde {new Date(product.seller.memberSince).getFullYear()}
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

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Productos relacionados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mockProducts
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 5)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-[var(--color-border)] mb-2">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                    {relatedProduct.title}
                  </h3>
                  <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
                    ${relatedProduct.price.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;