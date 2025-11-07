# 🧩 Sistema de Componentes - UniShop Frontend

Este documento define el sistema de componentes del frontend de UniShop, basado en las especificaciones de diseño UI/UX y la identidad visual.

## 📋 Tabla de Contenidos

- [Principios del Sistema](#principios-del-sistema)
- [Componentes Base (UI)](#componentes-base-ui)
- [Componentes de Layout](#componentes-de-layout)
- [Componentes de Features](#componentes-de-features)
- [Componentes de Feedback](#componentes-de-feedback)
- [Patrones de Composición](#patrones-de-composición)

## 🎯 Principios del Sistema

### Atomic Design
- **Átomos**: Componentes base indivisibles (Button, Input, Icon)
- **Moléculas**: Combinaciones de átomos (SearchBar, Badge)
- **Organismos**: Grupos complejos de moléculas (Header, ProductCard)
- **Plantillas**: Estructuras de página con organismos
- **Páginas**: Instancias específicas de plantillas

### Principios de Diseño
- **Reutilizable**: Cada componente debe ser reutilizable en múltiples contextos
- **Componible**: Componentes deben combinarse fácilmente
- **Accesible**: WCAG 2.1 AA compliance
- **Consistente**: Diseño system unificado
- **Performante**: Optimizado para renderizado

## 🎨 Componentes Base (UI)

### Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  onClick
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary)]/90 focus:ring-[var(--color-secondary)]",
    outline: "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)]",
    ghost: "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]",
    success: "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90 focus:ring-[var(--color-success)]",
    error: "bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 focus:ring-[var(--color-error)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        loading && "cursor-wait"
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {icon}
      {children}
    </button>
  );
};
```

### Input Component

```typescript
// components/ui/Input.tsx
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  helperText,
  leftIcon,
  rightIcon
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--color-text-primary)]"
      >
        {label}
        {required && <span className="text-[var(--color-error)] ml-1">*</span>}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-[var(--color-error)] focus:ring-[var(--color-error)]",
            !error && "border-[var(--color-border)]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {helperText}
        </p>
      )}
    </div>
  );
};
```

### Card Component

```typescript
// components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  onClick,
  hover = true
}: CardProps) => {
  const isInteractive = Boolean(onClick);

  return (
    <div
      className={cn(
        "rounded-xl bg-[var(--color-surface)] transition-all duration-200",
        {
          // Variants
          'border border-[var(--color-border)]': variant === 'outlined',
          'shadow-sm': variant === 'elevated',
          'shadow-md hover:shadow-lg cursor-pointer': variant === 'interactive',

          // Padding
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-10': padding === 'xl',

          // Estados
          'hover:shadow-md': hover && !isInteractive,
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2': isInteractive,
        },
        className
      )}
      onClick={onClick}
      role={isInteractive ? "button" : "article"}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </div>
  );
};
```

### Badge Component

```typescript
// components/ui/Badge.tsx
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  icon,
  removable,
  onRemove
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
      {
        // Variants
        'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]': variant === 'default',
        'bg-[var(--color-primary)] text-white': variant === 'primary',
        'bg-[var(--color-secondary)] text-white': variant === 'secondary',
        'bg-[var(--color-success)] text-white': variant === 'success',
        'bg-[var(--color-warning)] text-white': variant === 'warning',
        'bg-[var(--color-error)] text-white': variant === 'error',

        // Sizes
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-2.5 py-1 text-sm': size === 'md',
      }
    )}
  >
    {icon}
    {children}
    {removable && (
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white"
        aria-label="Remover"
      >
        ✕
      </button>
    )}
  </span>
);
```

## 🏗️ Componentes de Layout

### Header Component

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAuthenticated: boolean;
  user?: User;
  onThemeToggle: () => void;
  theme: 'light' | 'dark' | 'system';
}

const Header = ({
  searchQuery,
  onSearchChange,
  isAuthenticated,
  user,
  onThemeToggle,
  theme
}: HeaderProps) => (
  <header className="shadow-sm border-b border-[var(--color-border)] bg-[var(--color-surface)]">
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo - Clickable link to Home */}
        <div className="flex-shrink-0">
          <a
            href="/"
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span style={{ color: 'var(--color-primary)' }}>Uni</span>
            <span style={{ color: 'var(--color-secondary)' }}>Shop</span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar productos..."
          />
        </div>

        {/* Mobile Search */}
        <div className="md:hidden flex-1 max-w-xs mx-4">
          <MobileSearchButton />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            className="hidden md:flex"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <UserMenu user={user} />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </div>
  </header>
);
```

### Container Component

```typescript
// components/layout/Container.tsx
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  className?: string;
}

const Container = ({ size = 'lg', children, className }: ContainerProps) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </div>
  );
};
```

## 🎯 Componentes de Features

### ProductCard Component

```typescript
// components/features/product/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onContact?: () => void;
  priority?: 'high' | 'low';
}

const ProductCard = ({
  product,
  isFavorited = false,
  onFavoriteToggle,
  onContact,
  priority = 'low'
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      variant="elevated"
      padding="none"
      className="group overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-border)]">
        <img
          src={product.images[0]}
          alt={product.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          loading={priority === 'high' ? 'eager' : 'lazy'}
        />

        {/* Overlay de acciones */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavoriteToggle}
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
        <Badge
          variant={product.condition === 'new' ? 'success' : 'default'}
          size="sm"
          className="absolute top-3 left-3"
        >
          {product.condition === 'new' ? 'Nuevo' : 'Usado'}
        </Badge>
      </div>

      {/* Información del producto */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {product.title}
        </h3>

        <p className="text-lg font-bold text-[var(--color-primary)]">
          ${product.price.toLocaleString()}
        </p>

        <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Campus Pasto</span>
          </div>
        </div>


      </div>
    </Card>
  );
};
```

### SearchBar Component

```typescript
// components/features/search/SearchBar.tsx
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  recentSearches?: string[];
  isLoading?: boolean;
  onFilterToggle?: () => void;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar productos...",
  suggestions = [],
  recentSearches = [],
  isLoading = false,
  onFilterToggle
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const allSuggestions = value.length > 0 ? suggestions : recentSearches;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      // Handle search
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          leftIcon={<Search className="h-5 w-5" />}
          rightIcon={
            <div className="flex items-center gap-1">
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setShowSuggestions(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {onFilterToggle && (
                <button
                  type="button"
                  onClick={onFilterToggle}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Mostrar filtros"
                >
                  <Filter className="h-4 w-4" />
                </button>
              )}
            </div>
          }
          className="pr-20"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="absolute right-1 top-1 bottom-1 px-4"
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Sugerencias */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {value.length === 0 && recentSearches.length > 0 && (
            <div className="px-4 py-2 text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
              Búsquedas recientes
            </div>
          )}
          {allSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-[var(--color-background)] transition-colors flex items-center gap-2",
                index === selectedIndex && "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              )}
            >
              {value.length === 0 ? (
                <History className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## 💬 Componentes de Feedback

### Skeleton Component

```typescript
// components/feedback/Skeleton.tsx
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-[var(--color-border)] via-[var(--color-surface)] to-[var(--color-border)] bg-[length:200px_100%]",
        variants[variant],
        className
      )}
    />
  );
};

// Skeleton compuesto para ProductCard
export const ProductCardSkeleton = () => (
  <Card padding="none" className="overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" variant="text" />
      <Skeleton className="h-6 w-1/2" variant="text" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/3" variant="text" />
        <Skeleton className="h-3 w-1/4" variant="text" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" variant="circular" />
        <Skeleton className="h-3 w-20" variant="text" />
        <Skeleton className="h-3 w-8 ml-auto" variant="text" />
      </div>
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  </Card>
);
```

### Toast Component

```typescript
// components/feedback/Toast.tsx
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  duration?: number;
}

const Toast = ({ message, type = 'info', onClose, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };

  const colors = {
    success: 'bg-[var(--color-success)]',
    error: 'bg-[var(--color-error)]',
    warning: 'bg-[var(--color-warning)]',
    info: 'bg-[var(--color-primary)]'
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg max-w-sm",
        colors[type]
      )}
    >
      {icons[type]}
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="p-1 hover:bg-white/20 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
```

## 🔧 Patrones de Composición

### Compound Components Pattern

```typescript
// components/ui/Tabs.tsx
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

// Context para compartir estado
const TabsContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const Tabs = ({ defaultValue, value, onValueChange, children }: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }: TabListProps) => (
  <div className="flex border-b border-[var(--color-border)]">
    {children}
  </div>
);

const Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
        isActive
          ? "border-[var(--color-primary)] text-[var(--color-primary)]"
          : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      )}
    >
      {children}
    </button>
  );
};

const TabContent = ({ value, children }: TabContentProps) => {
  const context = useContext(TabsContext);
  if (!context) return null;

  return context.value === value ? <div>{children}</div> : null;
};

// Uso
<Tabs defaultValue="productos">
  <TabList>
    <Tab value="productos">Mis Productos</Tab>
    <Tab value="favoritos">Favoritos</Tab>
    <Tab value="ventas">Historial de Ventas</Tab>
  </TabList>

  <TabContent value="productos">
    {/* Contenido de productos */}
  </TabContent>

  <TabContent value="favoritos">
    {/* Contenido de favoritos */}
  </TabContent>

  <TabContent value="ventas">
    {/* Contenido de ventas */}
  </TabContent>
</Tabs>
```

### Render Props Pattern

```typescript
// components/ui/Popover.tsx
interface PopoverProps {
  trigger: React.ReactNode;
  children: (props: { isOpen: boolean; close: () => void }) => React.ReactNode;
}

const Popover = ({ trigger, children }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lógica de popover...

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          ref={contentRef}
          className="absolute z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg p-4"
        >
          {children({ isOpen, close: () => setIsOpen(false) })}
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
    <div className="space-y-2">
      <Button variant="ghost" fullWidth onClick={close}>
        Ver Perfil
      </Button>
      <Button variant="ghost" fullWidth onClick={close}>
        Configuración
      </Button>
      <hr className="border-[var(--color-border)]" />
      <Button variant="ghost" fullWidth onClick={() => {
        // Logout logic
        close();
      }}>
        Cerrar Sesión
      </Button>
    </div>
  )}
</Popover>
```

## 📚 Referencias

- [Atomic Design](http://atomicdesign.bradfrost.com/)
- [Component Composition Patterns](https://www.patterns.dev/posts/component-composition)
- [React Design Patterns](https://www.patterns.dev/posts/react-patterns)