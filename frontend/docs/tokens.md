# 🎨 Tokens de Diseño - UniShop Frontend

Este documento define los tokens de diseño utilizados en el frontend de UniShop, basados en la identidad visual y las especificaciones de diseño UI/UX.

## 📋 Tabla de Contenidos

- [Sistema de Tokens](#sistema-de-tokens)
- [Colores](#colores)
- [Espaciado](#espaciado)
- [Tipografía](#tipografía)
- [Sombras y Bordes](#sombras-y-bordes)
- [Animaciones](#animaciones)
- [Breakpoints](#breakpoints)
- [Implementación Técnica](#implementación-técnica)

## 🎯 Sistema de Tokens

Los tokens de diseño son variables centralizadas que garantizan consistencia visual y permiten cambios globales. Están organizados en categorías lógicas y siguen una nomenclatura consistente.

### Principios
- **Centralizados**: Un solo lugar para definir valores
- **Escalables**: Fáciles de extender y modificar
- **Accesibles**: Nombres descriptivos y consistentes
- **Técnicamente agnósticos**: Independientes de la tecnología de implementación

### Nomenclatura
```
--[category]-[property]-[variant]
```

Ejemplos:
- `--color-primary` - Color primario
- `--color-text-secondary` - Color de texto secundario
- `--space-4` - Espaciado de 16px
- `--font-size-lg` - Tamaño de fuente grande

## 🎨 Colores

### Paleta Base (Modo Claro)

```css
:root {
  /* Colores primarios */
  --color-primary: #1E63D0;
  --color-secondary: #FF7A33;

  /* Colores semánticos */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Colores neutros */
  --color-background: #F8F9FB;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #707070;
  --color-border: #E0E0E0;

  /* Colores de estado */
  --color-hover: rgba(30, 99, 208, 0.1);
  --color-focus: rgba(30, 99, 208, 0.2);
  --color-disabled: rgba(26, 26, 26, 0.5);
}
```

### Paleta Oscura

```css
[data-theme="dark"] {
  /* Colores primarios (más brillantes en oscuro) */
  --color-primary: #4D8EFF;
  --color-secondary: #FF9C4A;

  /* Colores semánticos (más brillantes) */
  --color-success: #34D399;
  --color-warning: #FCD34D;
  --color-error: #F87171;

  /* Colores neutros oscuros */
  --color-background: #0E1116;
  --color-surface: #171C22;
  --color-text-primary: #F3F4F6;
  --color-text-secondary: #9CA3AF;
  --color-border: #374151;

  /* Colores de estado */
  --color-hover: rgba(77, 142, 255, 0.1);
  --color-focus: rgba(77, 142, 255, 0.2);
  --color-disabled: rgba(243, 244, 246, 0.5);
}
```

### Colores de Gradiente

```css
/* Gradientes para elementos especiales */
--gradient-primary: linear-gradient(135deg, #1E63D0 0%, #4D8EFF 100%);
--gradient-secondary: linear-gradient(135deg, #FF7A33 0%, #FF9C4A 100%);
--gradient-surface: linear-gradient(135deg, #FFFFFF 0%, #F8F9FB 100%);

[data-theme="dark"] {
  --gradient-surface: linear-gradient(135deg, #171C22 0%, #0E1116 100%);
}
```

### Colores de Iconos y Estados

```css
/* Estados de interacción */
--color-icon-primary: var(--color-primary);
--color-icon-secondary: var(--color-text-secondary);
--color-icon-success: var(--color-success);
--color-icon-warning: var(--color-warning);
--color-icon-error: var(--color-error);

/* Estados específicos */
--color-favorite: #EF4444;
--color-favorite-fill: #F87171;
--color-star: #F59E0B;
--color-star-fill: #FCD34D;
```

## 📏 Espaciado

### Escala de Espaciado (Base 4px)

```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### Aplicaciones del Espaciado

```css
/* Padding interno de componentes */
--padding-xs: var(--space-2);    /* 8px */
--padding-sm: var(--space-3);    /* 12px */
--padding-md: var(--space-4);    /* 16px */
--padding-lg: var(--space-6);    /* 24px */
--padding-xl: var(--space-8);    /* 32px */

/* Márgenes entre elementos */
--margin-xs: var(--space-2);     /* 8px */
--margin-sm: var(--space-3);     /* 12px */
--margin-md: var(--space-4);     /* 16px */
--margin-lg: var(--space-6);     /* 24px */
--margin-xl: var(--space-8);     /* 32px */

/* Espaciado de layout */
--gap-xs: var(--space-2);        /* 8px */
--gap-sm: var(--space-3);        /* 12px */
--gap-md: var(--space-4);        /* 16px */
--gap-lg: var(--space-6);        /* 24px */
--gap-xl: var(--space-8);        /* 32px */
```

## ✍️ Tipografía

### Familia y Pesos

```css
:root {
  /* Familia tipográfica */
  --font-family-primary: 'Inter', system-ui, -apple-system, sans-serif;

  /* Pesos de fuente */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Altura de línea */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Espaciado de letras */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
}
```

### Tamaños de Fuente

```css
:root {
  /* Escala tipográfica */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
  --font-size-6xl: 3.75rem;     /* 60px */
}
```

### Configuración por Componente

```css
/* Headings */
--heading-1: var(--font-size-4xl) / var(--line-height-tight) var(--font-weight-bold);
--heading-2: var(--font-size-3xl) / var(--line-height-tight) var(--font-weight-bold);
--heading-3: var(--font-size-2xl) / var(--line-height-tight) var(--font-weight-semibold);
--heading-4: var(--font-size-xl) / var(--line-height-tight) var(--font-weight-semibold);
--heading-5: var(--font-size-lg) / var(--line-height-tight) var(--font-weight-semibold);
--heading-6: var(--font-size-base) / var(--line-height-tight) var(--font-weight-semibold);

/* Body text */
--body-lg: var(--font-size-lg) / var(--line-height-relaxed) var(--font-weight-normal);
--body-md: var(--font-size-base) / var(--line-height-relaxed) var(--font-weight-normal);
--body-sm: var(--font-size-sm) / var(--line-height-normal) var(--font-weight-normal);

/* UI text */
--ui-lg: var(--font-size-lg) / var(--line-height-normal) var(--font-weight-medium);
--ui-md: var(--font-size-base) / var(--line-height-normal) var(--font-weight-medium);
--ui-sm: var(--font-size-sm) / var(--line-height-normal) var(--font-weight-medium);
```

## 🌑 Sombras y Bordes

### Sombras

```css
:root {
  /* Sombras sutiles */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Sombras coloreadas */
  --shadow-primary: 0 4px 6px -1px rgba(30, 99, 208, 0.1), 0 2px 4px -1px rgba(30, 99, 208, 0.06);
  --shadow-secondary: 0 4px 6px -1px rgba(255, 122, 51, 0.1), 0 2px 4px -1px rgba(255, 122, 51, 0.06);
}
```

### Bordes

```css
:root {
  /* Radio de borde */
  --border-radius-none: 0;
  --border-radius-sm: 0.125rem;    /* 2px */
  --border-radius-md: 0.375rem;    /* 6px */
  --border-radius-lg: 0.5rem;      /* 8px */
  --border-radius-xl: 0.75rem;     /* 12px */
  --border-radius-2xl: 1rem;       /* 16px */
  --border-radius-full: 9999px;

  /* Ancho de borde */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;
}
```

## ✨ Animaciones

### Duraciones

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

### Funciones de Easing

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Animaciones Específicas

```css
/* Fade animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer effect */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

## 📱 Breakpoints

### Breakpoints Principales

```css
:root {
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Container Max-Widths

```css
:root {
  /* Container sizes */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  --container-full: 100%;
}
```

### Responsive Utilities

```css
/* Responsive spacing */
@media (min-width: 640px) {
  :root {
    --container-padding: var(--space-6);
  }
}

@media (min-width: 768px) {
  :root {
    --container-padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: var(--space-12);
  }
}

@media (min-width: 1280px) {
  :root {
    --container-padding: var(--space-16);
  }
}

@media (min-width: 1536px) {
  :root {
    --container-padding: var(--space-20);
  }
}
```

## 🔧 Implementación Técnica

### CSS Custom Properties

```css
/* Definición centralizada en :root */
:root {
  /* Todos los tokens definidos arriba */
}

/* Modo oscuro */
[data-theme="dark"] {
  /* Overrides para modo oscuro */
}

/* Tema específico (futuro) */
[data-theme="high-contrast"] {
  /* Overrides para alto contraste */
}
```

### JavaScript Access

```typescript
// utils/tokens.ts
export const tokens = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    // ...
  },
  spacing: {
    xs: 'var(--space-2)',
    sm: 'var(--space-3)',
    md: 'var(--space-4)',
    // ...
  },
  // ...
} as const;

// Uso en componentes
const buttonStyles = {
  backgroundColor: tokens.colors.primary,
  padding: tokens.spacing.md,
};
```

### Tailwind Integration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        // ...
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        // ...
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
        'slide-up': 'slideUp var(--duration-normal) var(--ease-out)',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
};
```

### TypeScript Types

```typescript
// types/tokens.ts
export type ColorToken =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'background'
  | 'surface'
  | 'text-primary'
  | 'text-secondary'
  | 'border';

export type SpacingToken =
  | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';

export type FontSizeToken =
  | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

// Utility functions
export const getColor = (token: ColorToken): string => `var(--color-${token})`;
export const getSpace = (token: SpacingToken): string => `var(--space-${token})`;
export const getFontSize = (token: FontSizeToken): string => `var(--font-size-${token})`;
```

### Theme Provider

```typescript
// contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme === 'system' ? 'light' : theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 📚 Referencias

- [Design Tokens](https://www.designtokens.org/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Systematic CSS](https://systematiccss.com/)