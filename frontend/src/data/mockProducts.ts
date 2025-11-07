import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Calculadora Científica Casio FX-991ES Plus',
    description: 'Calculadora científica avanzada con funciones de ingeniería, perfecta para estudiantes de matemáticas, física e ingeniería. Incluye modo examen y batería de larga duración.',
    price: 125000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Tecnología',
    seller: {
      id: 'seller-1',
      name: 'María González',
      email: 'maria.gonzalez@campusucc.edu.co',
      rating: 4.8,
      phoneVerified: true,
      memberSince: new Date('2024-03-15'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Central',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
    updatedAt: new Date(),
    tags: ['calculadora', 'científica', 'casio', 'matemáticas', 'ingeniería'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '2',
    title: 'Libro de Cálculo Diferencial - James Stewart',
    description: 'Libro de cálculo diferencial e integral, edición 8va. Excelente estado, sin subrayados. Ideal para estudiantes de ingeniería y matemáticas.',
    price: 85000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Libros',
    seller: {
      id: 'seller-2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@campusucc.edu.co',
      rating: 4.6,
      phoneVerified: true,
      memberSince: new Date('2024-01-20'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Norte',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
    updatedAt: new Date(),
    tags: ['libro', 'cálculo', 'matemáticas', 'stewart', 'ingeniería'],
    isFavorited: true,
    status: 'ACTIVE'
  },
  {
    id: '3',
    title: 'Audífonos Sony WH-1000XM4',
    description: 'Audífonos inalámbricos con cancelación de ruido activa. Calidad de sonido excepcional, batería de 30 horas. Incluye estuche original.',
    price: 450000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Tecnología',
    seller: {
      id: 'seller-3',
      name: 'Ana López',
      email: 'ana.lopez@campusucc.edu.co',
      rating: 4.9,
      phoneVerified: true,
      memberSince: new Date('2023-11-10'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Central',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    updatedAt: new Date(),
    tags: ['audífonos', 'sony', 'cancelación', 'ruido', 'inalámbricos'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '4',
    title: 'Mochila para Laptop Dell',
    description: 'Mochila resistente al agua con compartimento acolchado para laptop de hasta 15.6". Múltiples bolsillos organizadores. Color negro, como nueva.',
    price: 65000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Accesorios',
    seller: {
      id: 'seller-4',
      name: 'Juan Martínez',
      email: 'juan.martinez@campusucc.edu.co',
      rating: 4.4,
      phoneVerified: true,
      memberSince: new Date('2024-02-05'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Sur',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    updatedAt: new Date(),
    tags: ['mochila', 'laptop', 'dell', 'accesorios', 'estudiante'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '5',
    title: 'Kit de Herramientas Stanley',
    description: 'Set completo de herramientas profesionales Stanley con caja organizadora. Incluye destornilladores, alicates, martillo y más. Ideal para estudiantes de ingeniería.',
    price: 180000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Herramientas',
    seller: {
      id: 'seller-5',
      name: 'Laura Sánchez',
      email: 'laura.sanchez@campusucc.edu.co',
      rating: 4.7,
      phoneVerified: true,
      memberSince: new Date('2023-09-12'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Central',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días atrás
    updatedAt: new Date(),
    tags: ['herramientas', 'stanley', 'ingeniería', 'profesional', 'kit'],
    isFavorited: true,
    status: 'ACTIVE'
  },
  {
    id: '6',
    title: 'Cafetera Italiana Bialetti',
    description: 'Cafetera italiana clásica Bialetti de 6 tazas. Perfecta para estudiantes que aman el buen café. En excelente estado, muy poco uso.',
    price: 35000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Hogar',
    seller: {
      id: 'seller-6',
      name: 'Pedro Gómez',
      email: 'pedro.gomez@campusucc.edu.co',
      rating: 4.5,
      phoneVerified: true,
      memberSince: new Date('2024-04-01'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Norte',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 días atrás
    updatedAt: new Date(),
    tags: ['cafetera', 'bialetti', 'café', 'cocina', 'hogar'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '7',
    title: 'Teclado Mecánico Logitech MX Keys',
    description: 'Teclado mecánico inalámbrico con retroiluminación. Conectividad multi-dispositivo, batería de 10 días. Incluye receptor USB.',
    price: 280000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Tecnología',
    seller: {
      id: 'seller-7',
      name: 'Sofia Ramírez',
      email: 'sofia.ramirez@campusucc.edu.co',
      rating: 4.8,
      phoneVerified: true,
      memberSince: new Date('2023-12-08'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Central',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
    updatedAt: new Date(),
    tags: ['teclado', 'mecánico', 'logitech', 'inalámbrico', 'retroiluminado'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '8',
    title: 'Atlas de Anatomía Humana - Netter',
    description: 'Atlas de anatomía humana de Frank Netter, edición completa. Libro esencial para estudiantes de medicina y biología. Estado impecable.',
    price: 220000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Libros',
    seller: {
      id: 'seller-8',
      name: 'Diego Torres',
      email: 'diego.torres@campusucc.edu.co',
      rating: 4.9,
      phoneVerified: true,
      memberSince: new Date('2023-08-20'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Sur',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    updatedAt: new Date(),
    tags: ['atlas', 'anatomía', 'netter', 'medicina', 'biología'],
    isFavorited: true,
    status: 'ACTIVE'
  },
  {
    id: '9',
    title: 'Silla Ergonómica para Escritorio',
    description: 'Silla ergonómica ajustable con soporte lumbar. Ideal para largas sesiones de estudio. Color negro, muy cómoda y en perfecto estado.',
    price: 150000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Muebles',
    seller: {
      id: 'seller-9',
      name: 'Valentina Herrera',
      email: 'valentina.herrera@campusucc.edu.co',
      rating: 4.6,
      phoneVerified: true,
      memberSince: new Date('2024-01-15'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Norte',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    updatedAt: new Date(),
    tags: ['silla', 'ergonómica', 'escritorio', 'estudio', 'muebles'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '10',
    title: 'Set de Pinturas Acrílicas Winsor & Newton',
    description: 'Set profesional de pinturas acrílicas Winsor & Newton con 12 colores. Incluye pinceles y paleta. Perfecto para estudiantes de artes visuales.',
    price: 95000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Arte',
    seller: {
      id: 'seller-10',
      name: 'Andrés Morales',
      email: 'andres.morales@campusucc.edu.co',
      rating: 4.7,
      phoneVerified: true,
      memberSince: new Date('2024-03-01'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Central',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
    updatedAt: new Date(),
    tags: ['pinturas', 'acrílicas', 'winsor', 'newton', 'arte', 'pinceles'],
    isFavorited: false,
    status: 'ACTIVE'
  },
  {
    id: '11',
    title: 'Proyector Epson EB-S41',
    description: 'Proyector de 3,300 lúmenes, resolución SVGA. Conectividad HDMI, USB. Ideal para presentaciones académicas. Incluye cable HDMI.',
    price: 750000,
    condition: 'new',
    images: ['/api/placeholder/400/400'],
    category: 'Tecnología',
    seller: {
      id: 'seller-11',
      name: 'Camila Vargas',
      email: 'camila.vargas@campusucc.edu.co',
      rating: 4.8,
      phoneVerified: true,
      memberSince: new Date('2023-10-25'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Sur',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días atrás
    updatedAt: new Date(),
    tags: ['proyector', 'epson', 'presentaciones', 'académico', 'hdmi'],
    isFavorited: true,
    status: 'ACTIVE'
  },
  {
    id: '12',
    title: 'Bicicleta Montañera Specialized',
    description: 'Bicicleta de montaña Specialized Rockhopper Expert 29". Excelente para rutas universitarias. Incluye candado y luces. Estado impecable.',
    price: 1200000,
    condition: 'used',
    images: ['/api/placeholder/400/400'],
    category: 'Deportes',
    seller: {
      id: 'seller-12',
      name: 'Mateo Castro',
      email: 'mateo.castro@campusucc.edu.co',
      rating: 4.9,
      phoneVerified: true,
      memberSince: new Date('2023-07-10'),
      avatar: '/api/placeholder/100/100'
    },
    location: 'Campus Norte',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 días atrás
    updatedAt: new Date(),
    tags: ['bicicleta', 'montañera', 'specialized', 'deportes', 'universitaria'],
    isFavorited: false,
    status: 'ACTIVE'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getProductsBySeller = (sellerId: string): Product[] => {
  return mockProducts.filter(product => product.seller.id === sellerId);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};