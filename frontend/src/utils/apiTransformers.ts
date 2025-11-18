import type { ApiProduct, Product, Seller } from '../types';

/**
 * Transforma un producto de la API al formato del frontend
 */
export function transformApiProduct(apiProduct: ApiProduct): Product {
  // Debug: log image transformation
  console.log('Transforming images:', apiProduct.images, 'to URLs:', apiProduct.images.map(img => img.imageUrl));

  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    description: apiProduct.description,
    price: Number(apiProduct.price),
    condition: apiProduct.condition === 'Nuevo' ? 'new' : 'used',
    images: apiProduct.images.map(img => img.imageUrl),
    category: apiProduct.category?.name || 'Sin categoría',
    seller: transformApiUserToSeller(apiProduct),
    location: 'Campus UCC', // Por defecto, ya que no viene del backend
    createdAt: new Date(apiProduct.createdAt),
    updatedAt: new Date(apiProduct.updatedAt),
    status: apiProduct.status || 'ACTIVE',
    isFavorited: false, // Por defecto, ya que no viene del backend
    tags: [], // Por defecto, ya que no viene del backend
  };
}

/**
 * Transforma un usuario de la API al formato Seller del frontend
 */
export function transformApiUserToSeller(apiProduct: ApiProduct): Seller {
  const userId = apiProduct.userId || '';
  return {
    id: userId,
    name: apiProduct.userName || 'Usuario desconocido',
    email: '', // No viene del backend
    avatar: generateRandomAvatar(userId), // Avatar aleatorio basado en el ID del usuario
    rating: 0, // Por defecto, ya que no viene del backend
    phoneVerified: false, // Por defecto, ya que no viene del backend
    memberSince: new Date(), // Por defecto, ya que no viene del backend
  };
}

/**
 * Transforma filtros del frontend a filtros de la API
 */
export function transformFiltersToApi(filters: {
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  condition?: 'new' | 'used';
  datePosted?: 'today' | 'week' | 'month';
  location?: string;
  search?: string;
}): import('../types').ApiFilters {
  const apiFilters: import('../types').ApiFilters = {};

  if (filters.search) {
    apiFilters.search = filters.search;
  }

  if (filters.categoryId !== undefined) {
    apiFilters.categoryId = filters.categoryId;
  }

  if (filters.priceMin !== undefined) {
    apiFilters.minPrice = filters.priceMin;
  }

  if (filters.priceMax !== undefined) {
    apiFilters.maxPrice = filters.priceMax;
  }

  // Nota: condition, datePosted, location no se mapean directamente
  // ya que el backend no tiene estos filtros específicos

  return apiFilters;
}

/**
 * Genera un avatar aleatorio usando DiceBear API con un seed
 */
export function generateRandomAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}