import type { ApiProduct, Product, Seller } from '../types';

/**
 * Transforma un producto de la API al formato del frontend
 */
export function transformApiProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    description: apiProduct.description,
    price: Number(apiProduct.price),
    condition: 'used', // Por defecto, asumimos usado ya que no viene del backend
    images: apiProduct.images,
    category: apiProduct.category.name,
    seller: transformApiUserToSeller(apiProduct.user),
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
export function transformApiUserToSeller(apiUser: ApiProduct['user']): Seller {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    rating: 0, // Por defecto, ya que no viene del backend
    phoneVerified: false, // Por defecto, ya que no viene del backend
    memberSince: new Date(), // Por defecto, ya que no viene del backend
  };
}

/**
 * Transforma filtros del frontend a filtros de la API
 */
export function transformFiltersToApi(filters: {
  category?: string;
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

  if (filters.priceMin !== undefined) {
    apiFilters.minPrice = filters.priceMin;
  }

  if (filters.priceMax !== undefined) {
    apiFilters.maxPrice = filters.priceMax;
  }

  // Nota: category, condition, datePosted, location no se mapean directamente
  // ya que el backend no tiene estos filtros específicos

  return apiFilters;
}