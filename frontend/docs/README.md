# 📱 Documentación del Frontend - UniShop

Esta documentación específica del frontend se basa en los documentos principales del proyecto y establece las convenciones, estructura y patrones de desarrollo para la interfaz de usuario de UniShop.

## 📋 Tabla de Contenidos

- [Arquitectura del Frontend](#arquitectura-del-frontend)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Sistema de Componentes](#sistema-de-componentes)
- [Tokens de Diseño](#tokens-de-diseño)
- [Vistas Principales](#vistas-principales)
- [Patrones de Desarrollo](#patrones-de-desarrollo)
- [Convenciones de Código](#convenciones-de-código)

## 🏗️ Arquitectura del Frontend

### Stack Tecnológico
- **Framework**: React 19 con TypeScript
- **Styling**: Tailwind CSS v4 con configuración personalizada
- **Iconografía**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Linter**: ESLint con configuración personalizada

### Principios Arquitectónicos
- **Componentización**: Todo es un componente reutilizable
- **Separación de responsabilidades**: Lógica, presentación y datos separados
- **Accesibilidad**: WCAG 2.1 AA compliance
- **Performance**: Optimización para Core Web Vitals
- **Mantenibilidad**: Código autodocumentado y testable

## 📁 Estructura de Carpetas

```
frontend/
├── docs/                    # Documentación específica del frontend
│   ├── README.md           # Esta documentación
│   ├── components.md       # Sistema de componentes
│   ├── tokens.md          # Tokens de diseño
│   ├── views.md           # Vistas principales
│   └── patterns.md        # Patrones de desarrollo
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes base (Button, Input, Card)
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   ├── forms/         # Form components
│   │   ├── feedback/      # Loading, Toast, Modal
│   │   └── features/      # Componentes específicos de features
│   │       ├── product/   # ProductCard, ProductGrid
│   │       ├── auth/      # LoginForm, RegisterForm
│   │       └── search/    # SearchBar, Filters
│   ├── views/             # Vistas principales (páginas)
│   │   ├── Home/          # Página principal
│   │   ├── Product/       # Detalle de producto
│   │   ├── Profile/       # Perfil de usuario
│   │   └── Auth/          # Autenticación
│   ├── hooks/             # Custom hooks
│   │   ├── useTheme.ts    # Manejo de tema
│   │   ├── useAuth.ts     # Autenticación
│   │   └── useLocalStorage.ts
│   ├── utils/             # Utilidades
│   │   ├── cn.ts          # Combinar clases CSS
│   │   ├── formatters.ts  # Formateo de datos
│   │   └── constants.ts   # Constantes del frontend
│   ├── styles/            # Estilos globales
│   │   ├── globals.css    # CSS global y variables
│   │   ├── tailwind.config.ts # Configuración Tailwind
│   │   └── themes/        # Configuración de temas
│   ├── types/             # TypeScript types
│   │   ├── ui.types.ts    # Interfaces de UI
│   │   ├── api.types.ts   # Tipos de API
│   │   └── index.ts       # Re-export de tipos
│   ├── services/          # Servicios de API
│   │   ├── api.ts         # Cliente HTTP
│   │   ├── auth.ts        # Servicios de autenticación
│   │   └── product.ts     # Servicios de productos
│   ├── contexts/          # React contexts
│   │   ├── ThemeContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── App.tsx            # Componente raíz
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # CSS global
├── public/                # Assets estáticos
├── tests/                 # Tests
│   ├── unit/             # Tests unitarios
│   ├── integration/      # Tests de integración
│   └── e2e/              # Tests end-to-end
└── package.json
```

## 🎨 Sistema de Componentes

### Componentes Base (UI)
- **Button**: Variantes primary, secondary, outline, ghost, success, error
- **Input**: Campos de texto con validación y estados
- **Card**: Contenedores con variantes elevated, outlined, interactive
- **Badge**: Etiquetas con colores semánticos
- **Skeleton**: Estados de carga

### Componentes de Layout
- **Header**: Navegación principal con búsqueda y autenticación
- **Sidebar**: Panel lateral colapsable
- **Container**: Wrapper responsivo con padding automático

### Componentes de Features
- **ProductCard**: Tarjeta de producto con acciones
- **ProductGrid**: Grid responsivo de productos
- **SearchBar**: Barra de búsqueda con autocompletado
- **FilterPanel**: Panel de filtros con categorías y precios

## 🎯 Tokens de Diseño

### Colores
```css
:root {
  /* Primarios */
  --color-primary: #1E63D0;
  --color-secondary: #FF7A33;

  /* Semánticos */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Neutros */
  --color-background: #F8F9FB;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #707070;
  --color-border: #E0E0E0;
}
```

### Espaciado
- Escala base de 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- Variables CSS: `--space-1` hasta `--space-24`

### Tipografía
- **Familia**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700
- **Escala**: Responsive con clamp()

## 📱 Vistas Principales

### Vista 01: Home (Implementada)
- Layout de dos columnas en desktop
- Header con búsqueda y autenticación
- Panel de filtros izquierdo
- Grid de productos derecha
- Totalmente responsiva

### Vista 02: Product Detail
- Galería de imágenes
- Información completa del producto
- Información del vendedor
- Botón de contacto vía WhatsApp

### Vista 03: User Profile
- Panel de usuario con navegación lateral
- Mis publicaciones, favoritos, historial
- Gestión de cuenta y verificación

### Vista 04: Authentication
- Modal de login/registro
- Formularios con validación
- Recuperación de contraseña

- Cola de tareas pendientes
- Detalle de revisión con acciones

## 🔄 Patrones de Desarrollo

### Estado Global
- **Context API** para tema y autenticación
- **Custom hooks** para lógica reutilizable
- **Local storage** para persistencia

### API Integration
- **React Query** para gestión de estado servidor
- **Servicios centralizados** por dominio
- **Tipos TypeScript** compartidos con backend

### Formularios
- **Validación en tiempo real**
- **Estados de carga y error**
- **Accesibilidad completa**

### Performance
- **Lazy loading** de componentes
- **Code splitting** por rutas
- **Image optimization** con Next.js Image
- **Virtual scrolling** para listas largas

## 📝 Convenciones de Código

### Naming
- **Componentes**: PascalCase (Button, ProductCard)
- **Archivos**: PascalCase para componentes, camelCase para utils
- **Hooks**: camelCase con prefijo use (useTheme, useAuth)
- **Types**: PascalCase con sufijo (ButtonProps, ProductData)

### Estructura de Componentes
```typescript
interface ComponentProps {
  // Props con tipos explícitos
}

const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Lógica del componente
  return (
    // JSX con clases Tailwind
  );
};

export default Component;
```

### Imports
```typescript
// React y hooks primero
import { useState, useEffect } from 'react';

// Librerías externas
import { Heart } from 'lucide-react';

// Componentes locales
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

// Utilidades
import { cn } from '@/utils/cn';
```

## 🧪 Testing Strategy

### Unit Tests
- Componentes con Testing Library
- Hooks con testing personalizado
- Utilidades con pruebas directas

### Integration Tests
- Flujos completos de usuario
- Interacción entre componentes
- API calls simulados

### E2E Tests
- Playwright para flujos críticos
- Navegación y formularios
- Responsive testing

## 🚀 Deployment

### Build Process
- **Vite** para desarrollo y build
- **TypeScript** checking estricto
- **ESLint** para calidad de código
- **Bundle analysis** para optimización

### Environment Variables
- **Desarrollo**: Variables locales
- **Producción**: Variables de entorno
- **Preview**: Staging environment

## 📚 Referencias

- [Documentos principales del proyecto](../docs/)
- [Identidad Visual y Filosofía de Diseño](../docs/identidad-visual-ui-ux.md)
- [Diseño UI/UX](../docs/diseno-ui-ux.md)
- [Decisiones Técnicas](../docs/decisiones-tecnicas.md)
- [Requerimientos](../docs/requerimientos.md)