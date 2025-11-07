# ===== Base image =====
FROM node:20-alpine

# Instala dumb-init para manejar correctamente las señales
RUN apk add --no-cache dumb-init

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (dev + prod) para build
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Build de TypeScript + Vite
RUN npm run build

# Opcional: eliminar devDependencies para reducir tamaño
RUN npm prune --production || true

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer el puerto que usa 'npm run preview'
EXPOSE 5174

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Ejecutar preview (sirve la app)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5174"]
