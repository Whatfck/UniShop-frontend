# 📱 Vistas Principales - UniShop Frontend

Este documento detalla las vistas principales del frontend de UniShop, organizadas según los requerimientos funcionales y las especificaciones de diseño UI/UX.

## 📋 Tabla de Contenidos

- [Vista 01: Home (Página Principal)](#vista-01-home-página-principal)
- [Vista 02: Product Detail (Detalle de Producto)](#vista-02-product-detail-detalle-de-producto)
- [Vista 03: User Profile (Perfil de Usuario)](#vista-03-user-profile-perfil-de-usuario)
- [Vista 04: Authentication (Autenticación)](#vista-04-authentication-autenticación)
- [Vista 05: Search Results (Resultados de Búsqueda)](#vista-05-search-results-resultados-de-búsqueda)
- [Vista 06: Create Product (Crear Producto)](#vista-06-create-product-crear-producto)
- [Vistas de Error](#vistas-de-error)

## 🏠 Vista 01: Home (Página Principal)

### Ubicación
- **Ruta**: `/`
- **Archivo**: `src/views/Home/Home.tsx`
- **Estado**: ✅ Implementada

### Estructura

```typescript
// src/views/Home/Home.tsx
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {/* Main Content */}
      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 order-1 lg:order-2">
            {isLoading ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid
                products={products}
                onProductClick={handleProductClick}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
```

### Componentes Principales

#### Header
- **Logo**: "UniShop" con colores diferenciados (clickable → Home)
- **SearchBar**: Búsqueda con autocompletado
- **Auth Buttons**: Login/Register o User Menu
- **Theme Toggle**: Interruptor modo claro/oscuro

#### HeroSection
- **Título principal**: Gradiente Uni/Shop
- **Subtítulo**: Explicación del valor
- **CTA Buttons**: "Comprar" y "Vender"
- **Estadísticas**: Productos, usuarios, transacciones
- **Badge UCC**: Identidad universitaria
- **Wave bottom**: Transición visual

#### FilterPanel
- **Categorías**: Lista de categorías con checkboxes
- **Rango de Precios**: Inputs numéricos para min/max
- **Condición**: Nuevo/Usado con checkboxes
- **Fecha**: Hoy, Esta semana, Este mes

#### ProductGrid
- **Grid responsivo**: 1-6 columnas según breakpoint
- **ProductCard**: Tarjetas con imagen, info y acciones
- **Skeleton Loading**: Estados de carga
- **Empty states**: Mensajes informativos

### Estados
- **Loading**: Skeletons mientras carga
- **Empty**: Mensaje cuando no hay productos
- **Error**: Manejo de errores de carga

### Interacciones
- **Búsqueda**: Redirige a `/search?q=query`
- **Filtros**: Actualización en tiempo real
- **Producto**: Click → `/product/:id`
- **Favoritos**: Toggle inmediato con feedback

## 📦 Vista 02: Product Detail (Detalle de Producto)

### Ubicación
- **Ruta**: `/product/:id`
- **Archivo**: `src/views/Product/ProductDetail.tsx`

### Estructura

```typescript
// src/views/Product/ProductDetail.tsx
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            <ProductGallery
              images={product?.images || []}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            <ProductInfo
              product={product}
              onFavoriteToggle={handleFavoriteToggle}
              onContact={handleContact}
            />

            <SellerInfo seller={product?.seller} />

            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </main>
    </div>
  );
};
```

### Componentes Principales

#### ProductGallery
- **Imagen principal**: Aspect ratio 1:1
- **Miniaturas**: Scroll horizontal
- **Zoom**: Click para vista ampliada
- **Skeleton**: Loading states

#### ProductInfo
- **Título y precio**: Prominentes
- **Descripción**: Texto completo
- **Badge condición**: Nuevo/Usado
- **Botón Contactar**: WhatsApp integration
- **Botón Favoritos**: Toggle con icono

#### SellerInfo
- **Avatar y nombre**: Click → perfil
- **Rating**: Estrellas + número
- **Ubicación**: Icono + texto
- **Miembro desde**: Fecha de registro

### Estados
- **Loading**: Skeletons para toda la vista
- **Not Found**: Producto no existe
- **Sold**: Producto vendido (badge especial)

## 👤 Vista 03: User Profile (Perfil de Usuario)

### Ubicación
- **Ruta**: `/profile/:id`
- **Archivo**: `src/views/Profile/UserProfile.tsx`

### Estructura

```typescript
// src/views/Profile/UserProfile.tsx
const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabList>
            <Tab value="products">Publicaciones ({user?.productCount})</Tab>
            <Tab value="reviews">Reseñas</Tab>
          </TabList>

          <TabContent value="products">
            <UserProducts userId={id} />
          </TabContent>

          <TabContent value="reviews">
            <UserReviews userId={id} />
          </TabContent>
        </Tabs>
      </main>
    </div>
  );
};
```

### Sub-vistas

#### ProfileHeader
- **Avatar grande**: 120x120px
- **Nombre y verificación**: Badge si verificado
- **Estadísticas**: Productos, rating, miembros desde
- **Ubicación**: Ciudad/campus

#### UserProducts
- **Grid de productos**: Solo productos activos
- **Estados**: Loading, empty, error

#### UserReviews
- **Lista de reseñas**: De compradores
- **Rating promedio**: Visual
- **Comentarios**: Texto completo

## 🔐 Vista 04: Authentication (Autenticación)

### Ubicación
- **Ruta**: Modal (no ruta dedicada)
- **Archivo**: `src/components/auth/LoginModal.tsx`, `src/components/auth/RegisterModal.tsx`
- **Estado**: ✅ Implementada

### Ubicación
- **Ruta**: Modal (no ruta dedicada)
- **Archivo**: `src/components/features/auth/AuthModal.tsx`

### Estructura

```typescript
// src/components/features/auth/AuthModal.tsx
const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="w-full max-w-md">
        <Tabs value={mode} onValueChange={setMode}>
          <TabList className="grid w-full grid-cols-2">
            <Tab value="login">Iniciar Sesión</Tab>
            <Tab value="register">Registrarse</Tab>
          </TabList>

          <TabContent value="login">
            <LoginForm onSuccess={onClose} />
          </TabContent>

          <TabContent value="register">
            <RegisterForm onSuccess={onClose} />
          </TabContent>
        </Tabs>
      </div>
    </Modal>
  );
};
```

### Formularios

#### LoginForm
- **Email**: Input con validación
- **Contraseña**: Input password
- **Recordar dispositivo**: Checkbox
- **Olvidé contraseña**: Link
- **Botón submit**: Loading state

#### RegisterForm
- **Nombre**: Input requerido
- **Email UCC**: Solo @campusucc.edu.co
- **Contraseña**: Con requisitos de seguridad
- **Confirmar contraseña**: Validación
- **Términos**: Checkbox requerido


## 🔍 Vista 05: Search Results (Resultados de Búsqueda)

### Ubicación
- **Ruta**: `/search`
- **Query params**: `?q=query&category=cat&price_min=min&price_max=max`
- **Archivo**: `src/views/Search/SearchResults.tsx`
- **Estado**: 🚧 Pendiente

### Estructura

```typescript
// src/views/Search/SearchResults.tsx
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        {/* Search Summary */}
        <SearchSummary query={query} totalResults={results?.total || 0} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 order-1 lg:order-2">
            <SearchResultsGrid
              products={results?.products || []}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
```

### Componentes Principales

#### SearchSummary
- **Query**: Texto buscado
- **Resultados**: "X resultados para 'query'"
- **Filtros activos**: Chips removibles

#### AdvancedFilters
- **Todos los filtros del Home**
- **Ordenamiento**: Precio, fecha, relevancia
- **Ubicación**: Filtros geográficos

#### SearchResultsGrid
- **Misma estructura que Home**
- **Load more**: Paginación infinita
- **Empty state**: "No se encontraron resultados"

## ➕ Vista 06: Create Product (Crear Producto)

### Ubicación
- **Ruta**: `/sell`
- **Archivo**: `src/views/Product/CreateProduct.tsx`
- **Acceso**: Usuarios autenticados con teléfono verificado
- **Estado**: 🚧 Pendiente

### Estructura

```typescript
// src/views/Product/CreateProduct.tsx
const CreateProduct = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const steps = [
    { id: 1, title: 'Información básica', component: BasicInfoStep },
    { id: 2, title: 'Imágenes', component: ImagesStep },
    { id: 3, title: 'Revisar y publicar', component: ReviewStep },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={step} steps={steps} />

        {/* Form Steps */}
        <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-sm">
          {steps.map(({ id, component: StepComponent }) => (
            step === id && (
              <StepComponent
                key={id}
                data={formData}
                onChange={setFormData}
                onNext={() => setStep(id + 1)}
                onPrev={() => setStep(id - 1)}
              />
            )
          ))}
        </div>
      </main>
    </div>
  );
};
```

### Pasos del Formulario

#### Paso 1: BasicInfoStep
- **Título**: Input requerido
- **Descripción**: Textarea
- **Precio**: Input numérico
- **Categoría**: Select dropdown
- **Condición**: Radio buttons (Nuevo/Usado)

#### Paso 2: ImagesStep
- **Upload área**: Drag & drop
- **Preview grid**: Imágenes seleccionadas
- **Orden**: Drag para reordenar
- **Validación**: Tamaño, formato, cantidad

#### Paso 3: ReviewStep
- **Preview completa**: Como se verá
- **Editar**: Botones para volver a pasos anteriores
- **Publicar**: Submit final

## ❌ Vistas de Error

### 404 Not Found

```typescript
// src/views/Error/NotFound.tsx
const NotFound = () => (
  <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-[var(--color-text-primary)]">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)]">
          Página no encontrada
        </h2>
        <p className="text-[var(--color-text-secondary)] max-w-md">
          La página que buscas no existe o ha sido movida.
        </p>
      </div>

      <div className="space-y-4">
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>

        <SearchBar placeholder="Buscar productos..." />
      </div>
    </div>
  </div>
);
```

### Error General

```typescript
// src/views/Error/ErrorPage.tsx
const ErrorPage = ({ error, resetError }: ErrorPageProps) => (
  <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
    <div className="text-center space-y-6 max-w-md">
      <div className="text-6xl">⚠️</div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Algo salió mal
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {error?.message || 'Ha ocurrido un error inesperado.'}
        </p>
      </div>

      <div className="space-x-4">
        <Button onClick={resetError} variant="outline">
          Intentar de nuevo
        </Button>
        <Button asChild>
          <Link to="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  </div>
);
```

## 📱 Consideraciones Responsivas

### Breakpoints por Vista
- **Mobile (< 640px)**: Layout de una columna, navegación simplificada
- **Tablet (640px - 1023px)**: Layout de dos columnas en algunas vistas
- **Desktop (> 1024px)**: Layout completo, sidebar siempre visible

### Touch Targets
- **Móvil**: Mínimo 44px de altura
- **Tablet**: Mínimo 40px de altura
- **Desktop**: Mínimo 32px de altura

### Imágenes Responsivas
- **Sizes attribute**: Optimización automática
- **Lazy loading**: Por defecto en todas las imágenes
- **Formatos modernos**: WebP con fallbacks

## 🔄 Navegación y Routing

### Estructura de Rutas

```typescript
// src/App.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/profile/:id',
    element: <UserProfile />,
  },
  {
    path: '/search',
    element: <SearchResults />,
  },
  {
    path: '/sell',
    element: (
      <ProtectedRoute requiredAuth requiredPhoneVerification>
        <CreateProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

### Guards de Ruta

```typescript
// components/auth/ProtectedRoute.tsx
const ProtectedRoute = ({
  children,
  requiredAuth = false,
  requiredRole,
  requiredPhoneVerification = false
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (requiredAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredPhoneVerification && !user?.phoneVerified) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
```

## 📊 Estados y Loading

### Estados Globales
- **Autenticación**: Usuario actual, loading, error
- **Tema**: Modo claro/oscuro/sistema
- **Productos**: Cache, favoritos, búsquedas recientes

### Loading States
- **Skeleton components**: Para contenido
- **Spinner**: Para acciones
- **Progressive loading**: Contenido aparece gradualmente

### Error Handling
- **Boundary components**: Error boundaries por sección
- **Toast notifications**: Mensajes de error temporales
- **Retry mechanisms**: Reintento automático en fallos de red

## 🎯 Próximos Pasos

1. **Implementar rutas faltantes**: ProductDetail, UserProfile, etc.
2. **Crear componentes base**: Button, Input, Card, etc.
3. **Implementar estado global**: Context para auth, theme, etc.
4. **Agregar servicios API**: Integración con backend
5. **Testing**: Unit tests y E2E para vistas críticas
6. **Performance**: Lazy loading, code splitting
7. **SEO**: Meta tags, structured data

## 📚 Referencias

- [Requerimientos Funcionales](../docs/requerimientos.md)
- [Diseño UI/UX](../docs/diseno-ui-ux.md)
- [Identidad Visual](../docs/identidad-visual-ui-ux.md)
- [React Router Documentation](https://reactrouter.com/)