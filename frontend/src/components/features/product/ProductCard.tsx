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
}

const ProductCard = ({
  product,
  isFavorited = false,
  onFavoriteToggle,
  onContact,
  onClick,
  priority = 'low',
  showContactButton = false
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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
          src={product.images[0] || '/api/placeholder/300/300'}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          loading={priority === 'high' ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

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
            backgroundColor: product.condition === 'new' ? 'var(--color-success)' : 'var(--color-surface)',
            color: product.condition === 'new' ? 'white' : 'var(--color-text-primary)',
            border: `1px solid var(--color-border)`
          }}
        >
          {product.condition === 'new' ? 'Nuevo' : 'Usado'}
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-2">
        <h3
          className="font-medium mb-1 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {product.title}
        </h3>

        <p
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--color-primary)' }}
        >
          ${product.price.toLocaleString().replace(/,/g, '.')}
        </p>

        <div
          className="flex items-center text-sm mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span>{product.seller.name}</span>
          </div>
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Clock className="h-3 w-3" />
            <span>{new Date(product.createdAt).toLocaleDateString('es-CO')}</span>
          </div>
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