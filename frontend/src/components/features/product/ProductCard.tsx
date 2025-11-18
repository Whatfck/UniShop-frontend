import { useState } from 'react';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Button } from '../../ui';
import { cn } from '../../../utils/cn';
import type { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onContact?: () => void;
  onClick?: () => void;
  priority?: 'high' | 'low';
  showContactButton?: boolean;
  isAuthenticated?: boolean;
}

const ProductCard = ({
  product,
  isFavorited = false,
  onFavoriteToggle,
  onContact,
  onClick,
  priority = 'low',
  showContactButton = false,
  isAuthenticated = false
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/300/300';

  return (
    <div
      className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-border)`
      }}
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
        <img
          src={imageUrl}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => {
            setImageLoaded(true);
            setImageError(false);
          }}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          loading={priority === 'high' ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Fallback image when original fails */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">Imagen no disponible</div>
            </div>
          </div>
        )}

        {/* Overlay de acciones */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavoriteToggle?.()}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
              aria-label={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Badge de condición */}
        <div
          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: product.condition === 'new' ? 'var(--color-secondary)' : 'var(--color-border)',
            color: product.condition === 'new' ? 'white' : 'var(--color-text-primary)'
          }}
        >
          {product.condition === 'new' ? 'Nuevo' : 'Usado'}
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3
          className="font-medium text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {product.title}
        </h3>

        <p
          className="text-base sm:text-lg font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          ${product.price.toLocaleString().replace(/,/g, '.')}
        </p>

        <div
          className="flex items-center text-xs sm:text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2">
          {!isAuthenticated ? (
            <div
              className="flex items-center gap-1 text-xs flex-shrink-0"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="hidden sm:inline">{new Date(product.createdAt).toLocaleDateString('es-CO')}</span>
              <span className="sm:hidden">{new Date(product.createdAt).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span className="truncate">{product.seller.name}</span>
            </div>
          )}
        </div>

        {showContactButton && (
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-3"
            onClick={() => onContact?.()}
          >
            Contactar
          </Button>
        )}


      </div>
    </div>
  );
};

export default ProductCard;