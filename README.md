# UniShop Frontend

Frontend de la aplicación UniShop, desarrollado con React, TypeScript y Vite.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Desarrollo Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con la URL del backend local
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. El frontend estará disponible en `http://localhost:5174`

## Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Configurar la variable de entorno `VITE_API_URL` con la URL del backend expuesto
3. Vercel detectará automáticamente la configuración de `vercel.json`

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Ejecutar ESLint
