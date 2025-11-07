// API base: asegurar que incluya el prefijo global '/api/v1' usado por el backend
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? `${RAW_API_URL}api/v1` : `${RAW_API_URL}/api/v1`;

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
  status: 'ACTIVE' | 'SOLD' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    profilePictureUrl?: string;
  };
}

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

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProducts(filters?: ApiFilters): Promise<ApiProduct[]> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return this.request<ApiProduct[]>(endpoint);
  }

  async getProduct(id: number): Promise<ApiProduct> {
    return this.request<ApiProduct>(`/products/${id}`);
  }

  async recordContact(productId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${productId}/contact`, {
      method: 'POST',
    });
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<any> {
    return this.request('/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiService = new ApiService();