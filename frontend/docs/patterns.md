# 🔄 Patrones de Desarrollo - UniShop Frontend

Este documento establece los patrones de desarrollo, convenciones de código y mejores prácticas para el frontend de UniShop.

## 📋 Tabla de Contenidos

- [Arquitectura y Organización](#arquitectura-y-organización)
- [Convenciones de Código](#convenciones-de-código)
- [Patrones de Componentes](#patrones-de-componentes)
- [Gestión de Estado](#gestión-de-estado)
- [API Integration](#api-integration)
- [Testing Strategy](#testing-strategy)
- [Performance](#performance)
- [Accesibilidad](#accesibilidad)

## 🏗️ Arquitectura y Organización

### Estructura de Carpetas

```
frontend/src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base (Button, Input)
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── forms/           # Form components
│   ├── feedback/        # Loading, Toast, Modal
│   └── features/        # Componentes específicos
├── views/               # Páginas principales
│   ├── Home/
│   ├── Product/
│   └── Profile/
├── hooks/               # Custom hooks
├── utils/               # Utilidades
├── services/            # API services
├── contexts/            # React contexts
├── types/               # TypeScript types
└── styles/              # Estilos globales
```

### Principios de Organización

#### Componentes
- **Un componente por archivo**: Cada componente en su propio archivo
- **Index files**: `export { default } from './Component'` para imports limpios
- **Carpeta por feature**: Componentes relacionados agrupados

#### Archivos
- **PascalCase** para componentes: `Button.tsx`, `ProductCard.tsx`
- **camelCase** para utilities: `formatPrice.ts`, `useAuth.ts`
- **kebab-case** para archivos de configuración: `tailwind.config.ts`

## 📝 Convenciones de Código

### TypeScript

#### Interfaces vs Types
```typescript
// Interfaces para objetos complejos
interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
}

// Types para uniones y primitivos
type Theme = 'light' | 'dark' | 'system';
type ButtonVariant = 'primary' | 'secondary' | 'outline';
```

#### Props
```typescript
interface ButtonProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick
}: ButtonProps) => {
  // Implementación
};
```

#### Custom Hooks
```typescript
// hooks/useTheme.ts
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Uso
const { theme, setTheme } = useTheme();
```

### Imports

#### Orden de Imports
```typescript
// 1. React y hooks
import { useState, useEffect } from 'react';

// 2. Librerías externas
import { Heart } from 'lucide-react';

// 3. Componentes internos
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 4. Utilidades
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatters';

// 5. Tipos
import type { Product } from '@/types/product';
```

#### Path Aliases
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

### CSS y Styling

#### Tailwind Classes
```typescript
// ✅ Bien: Classes organizadas por tipo
<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">

// ❌ Mal: Classes desorganizadas
<div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
```

#### CSS Variables
```typescript
// ✅ Bien: Usar variables CSS
const buttonStyles = {
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-text-on-primary)',
};

// ❌ Mal: Colores hardcodeados
const buttonStyles = {
  backgroundColor: '#1E63D0',
  color: '#FFFFFF',
};
```

#### Utility Function para Classes
```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso
const buttonClasses = cn(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  variant === 'primary' && "bg-[var(--color-primary)] text-white",
  size === 'sm' && "px-3 py-1.5 text-sm",
  disabled && "opacity-50 cursor-not-allowed"
);
```

## 🧩 Patrones de Componentes

### Atomic Design Pattern

#### Átomos (UI Base)
```typescript
// components/ui/Button.tsx
const Button = ({ variant, size, children, ...props }: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }))}
    {...props}
  >
    {children}
  </button>
);
```

#### Moléculas (Combinaciones)
```typescript
// components/ui/SearchBar.tsx
const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10"
    />
  </div>
);
```

#### Organismos (Componentes Complejos)
```typescript
// components/features/product/ProductCard.tsx
const ProductCard = ({ product, onClick }: ProductCardProps) => (
  <Card onClick={onClick} className="group cursor-pointer">
    <ProductImage image={product.images[0]} />
    <div className="p-4">
      <ProductInfo product={product} />
      <ProductActions product={product} />
    </div>
  </Card>
);
```

### Compound Components Pattern

```typescript
// components/ui/Tabs.tsx
const TabsContext = createContext<TabsContextType | null>(null);

const Tabs = ({ children, defaultValue }: TabsProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }: { children: React.ReactNode }) => (
  <div className="flex border-b">{children}</div>
);

const Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      onClick={() => context?.setValue(value)}
      className={cn(
        "px-4 py-2 border-b-2",
        isActive ? "border-primary text-primary" : "border-transparent"
      )}
    >
      {children}
    </button>
  );
};

const TabContent = ({ value, children }: TabContentProps) => {
  const context = useContext(TabsContext);
  return context?.value === value ? <div>{children}</div> : null;
};

// Uso
<Tabs defaultValue="productos">
  <TabList>
    <Tab value="productos">Productos</Tab>
    <Tab value="favoritos">Favoritos</Tab>
  </TabList>

  <TabContent value="productos">
    <ProductList />
  </TabContent>

  <TabContent value="favoritos">
    <FavoritesList />
  </TabContent>
</Tabs>
```

### Render Props Pattern

```typescript
// components/ui/Popover.tsx
interface PopoverProps {
  trigger: React.ReactNode;
  children: (props: { close: () => void }) => React.ReactNode;
}

const Popover = ({ trigger, children }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute" onClick={() => setIsOpen(false)}>
            {children({ close: () => setIsOpen(false) })}
          </div>
        </div>
      )}
    </>
  );
};

// Uso
<Popover
  trigger={<Button>Mi Cuenta</Button>}
>
  {({ close }) => (
    <div className="bg-white p-4 rounded shadow">
      <Button onClick={close}>Cerrar</Button>
    </div>
  )}
</Popover>
```

## 🔄 Gestión de Estado

### Context API para Estado Global

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hooks para Lógica Compleja

```typescript
// hooks/useProducts.ts
const useProducts = (filters: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts(filters);
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
};
```

### Estado Local con useReducer

```typescript
// Para formularios complejos
type FormState = {
  data: Partial<Product>;
  errors: Record<string, string>;
  isSubmitting: boolean;
};

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof Product; value: any }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'START_SUBMIT' }
  | { type: 'END_SUBMIT' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'START_SUBMIT':
      return { ...state, isSubmitting: true };
    case 'END_SUBMIT':
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
};
```

## 🌐 API Integration

### Service Layer Pattern

```typescript
// services/api.ts
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ... otros métodos HTTP
}

export const apiService = new ApiService(import.meta.env.VITE_API_URL);
```

### Domain Services

```typescript
// services/productService.ts
export const productService = {
  async getProducts(filters: ProductFilters): Promise<ProductResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    return apiService.get<ProductResponse>(`/products?${queryParams}`);
  },

  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  },

  async createProduct(product: CreateProductData): Promise<Product> {
    return apiService.post<Product>('/products', product);
  },

  async favoriteProduct(id: string): Promise<void> {
    return apiService.post(`/products/${id}/favorite`, {});
  },
};
```

### React Query para Estado Servidor

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFavoriteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productService.favoriteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('is accessible', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// components/features/product/__tests__/ProductCard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '../ProductCard';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    price: 100000,
    images: ['/test-image.jpg'],
    seller: { name: 'John Doe', rating: 4.5 },
    location: 'Campus Central',
    createdAt: new Date(),
  };

  it('displays product information correctly', () => {
    render(<ProductCard product={mockProduct} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.000')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page loads and displays products', async ({ page }) => {
  await page.goto('/');

  // Check header
  await expect(page.getByText('UniShop')).toBeVisible();

  // Check search bar
  await expect(page.getByPlaceholder('Buscar productos...')).toBeVisible();

  // Check products grid
  await expect(page.locator('[data-testid="product-card"]')).toHaveCount(12);

  // Check filters
  await expect(page.getByText('Filtros')).toBeVisible();
  await expect(page.getByText('Categorías')).toBeVisible();
});

test('search functionality works', async ({ page }) => {
  await page.goto('/');

  // Type in search
  await page.fill('[placeholder="Buscar productos..."]', 'calculadora');

  // Click search
  await page.click('button:has-text("Buscar")');

  // Should navigate to search results
  await expect(page).toHaveURL(/\/search\?q=calculadora/);
});
```

## ⚡ Performance

### Code Splitting

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./views/Home/Home'));
const ProductDetail = lazy(() => import('./views/Product/ProductDetail'));
const Profile = lazy(() => import('./views/Profile/UserProfile'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  </Suspense>
);
```

### Image Optimization

```typescript
// components/ui/OptimizedImage.tsx
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const OptimizedImage = ({ src, alt, className, priority }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-gray-200", className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
};
```

### Memoization

```typescript
// components/features/product/ProductCard.tsx
import { memo } from 'react';

const ProductCard = memo(({ product, onClick }: ProductCardProps) => {
  // Component implementation
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
```

## ♿ Accesibilidad

### ARIA Labels y Roles

```typescript
// components/ui/Button.tsx
const Button = ({ children, loading, ...props }: ButtonProps) => (
  <button
    {...props}
    aria-busy={loading}
    aria-disabled={props.disabled}
  >
    {loading && <span className="sr-only">Cargando...</span>}
    {children}
  </button>
);
```

### Focus Management

```typescript
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      containerRef.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};
```

### Screen Reader Support

```typescript
// components/features/product/ProductCard.tsx
const ProductCard = ({ product, isFavorited }: ProductCardProps) => (
  <article
    role="article"
    aria-labelledby={`product-${product.id}-title`}
    aria-describedby={`product-${product.id}-description`}
  >
    <img
      src={product.images[0]}
      alt={`Producto: ${product.title}`}
      aria-hidden="false"
    />

    <h3 id={`product-${product.id}-title`}>
      {product.title}
    </h3>

    <button
      onClick={handleFavorite}
      aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      aria-pressed={isFavorited}
    >
      <Heart
        className={cn(isFavorited && "fill-current")}
        aria-hidden="true"
      />
    </button>
  </article>
);
```

## 📚 Referencias

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance](https://web.dev/performance/)