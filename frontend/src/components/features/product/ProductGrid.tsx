import ProductCard from './ProductCard';
import type { Product } from '../../../types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
  onFavoriteToggle?: (productId: string) => void;
  onContact?: (product: Product) => void;
  showContactButton?: boolean;
}

const ProductGrid = ({
  products,
  isLoading = false,
  onProductClick,
  onFavoriteToggle,
  onContact,
  showContactButton = true
}: ProductGridProps) => {
  if (isLoading) {
    // Skeleton loading
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6" style={{ gap: 'var(--space-3)' }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl shadow-sm overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `1px solid var(--color-border)`
            }}
          >
            {/* Image skeleton */}
            <div
              className="aspect-square skeleton"
              style={{ backgroundColor: 'var(--color-border)' }}
            />

            {/* Content skeleton */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="space-y-2">
                <div className="h-4 skeleton rounded" />
                <div className="h-4 skeleton rounded w-3/4" />
              </div>
              <div className="h-6 skeleton rounded w-1/2" />
              <div className="flex items-center text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 skeleton rounded" />
                  <div className="h-3 skeleton rounded w-16" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0 flex-1">
                  <div className="h-3 skeleton rounded w-20" />
                </div>
                <div className="flex items-center gap-1 text-xs flex-shrink-0">
                  <div className="h-3 w-3 skeleton rounded" />
                  <div className="h-3 skeleton rounded w-12" />
                </div>
              </div>
              {showContactButton && (
                <div className="h-8 skeleton rounded-lg w-full mt-3" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          No se encontraron productos
        </h3>
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Intenta ajustar los filtros o busca con otros términos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6" style={{ gap: 'var(--space-3)' }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorited={product.isFavorited}
          onClick={() => onProductClick?.(product)}
          onFavoriteToggle={() => onFavoriteToggle?.(product.id)}
          onContact={() => onContact?.(product)}
          showContactButton={showContactButton}
        />
      ))}
    </div>
  );
};

export default ProductGrid;