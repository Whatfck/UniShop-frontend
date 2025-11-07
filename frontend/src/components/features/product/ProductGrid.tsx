import ProductCard from './ProductCard';
import type { Product } from '../../../types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
  onFavoriteToggle?: (productId: string) => void;
  onContact?: (product: Product) => void;
}

const ProductGrid = ({
  products,
  isLoading = false,
  onProductClick,
  onFavoriteToggle,
  onContact
}: ProductGridProps) => {
  if (isLoading) {
    // Skeleton loading
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" style={{ gap: 'var(--space-6)' }}>
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
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-4 skeleton rounded" />
                <div className="h-4 skeleton rounded w-3/4" />
              </div>
              <div className="h-6 skeleton rounded w-1/2" />
              <div className="flex justify-between">
                <div className="h-3 skeleton rounded w-1/3" />
                <div className="h-3 skeleton rounded w-1/4" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 skeleton rounded-full" />
                <div className="h-3 skeleton rounded w-20" />
                <div className="h-3 skeleton rounded w-8 ml-auto" />
              </div>
              <div className="h-8 skeleton rounded-lg w-full" />
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" style={{ gap: 'var(--space-6)' }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorited={product.isFavorited}
          onClick={() => onProductClick?.(product)}
          onFavoriteToggle={() => onFavoriteToggle?.(product.id)}
          onContact={() => onContact?.(product)}
          showContactButton={true}
        />
      ))}
    </div>
  );
};

export default ProductGrid;