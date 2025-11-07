// Core types
export type Theme = 'light' | 'dark' | 'system';

// Product types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'used';
  images: string[];
  category: string;
  seller: Seller;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorited?: boolean;
  tags?: string[];
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE';
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  phoneVerified: boolean;
  memberSince: Date;
}

// Backend API Product types
export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  categoryId: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  userId: string;
  images: string[];
  status?: 'ACTIVE' | 'SOLD' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Filter types
export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: 'new' | 'used';
  datePosted?: 'today' | 'week' | 'month';
  location?: string;
}

// Backend API Filter types
export interface ApiFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: 'ACTIVE' | 'SOLD' | 'INACTIVE';
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}

// Search types
export interface SearchFilters extends ProductFilters {
  query?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_desc';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  phoneVerified: boolean;
  createdAt: Date;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Form types
export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'used';
  images: File[];
}

// Component prop types
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];