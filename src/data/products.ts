import type { Product, Category, BannerSlide, Announcement } from '@/types';

/**
 * URLs de imagenes de Unsplash para productos
 */
const UNSPLASH = {
  remeras: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
  ],
  hoodies: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80',
  ],
  pants: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  ],
  categories: [
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
  ],
  banners: [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
  ],
};

/**
 * Categorias de la tienda
 */
export const categories: Category[] = [
  {
    id: 'remeras',
    slug: 'remeras',
    name: 'Remeras',
    description: 'Remeras oversize y regular con disenos unicos inspirados en la estetica japonesa y el streetwear alternativo.',
    image: UNSPLASH.categories[0],
    productCount: 45,
  },
  {
    id: 'hoodies',
    slug: 'hoodies',
    name: 'Hoodies',
    description: 'Buzos y hoodies de alta calidad con estampados exclusivos y corte oversize.',
    image: UNSPLASH.categories[1],
    productCount: 28,
  },
  {
    id: 'pants-shorts',
    slug: 'pants-shorts',
    name: 'Pants & Shorts',
    description: 'Pantalones cargo, joggers y shorts con el estilo urbano japones que nos caracteriza.',
    image: UNSPLASH.categories[2],
    productCount: 32,
  },
  {
    id: 'accesorios',
    slug: 'accesorios',
    name: 'Accesorios',
    description: 'Gorras, bolsos, cadenas y accesorios para completar tu look.',
    image: UNSPLASH.categories[3],
    productCount: 18,
  },
  {
    id: 'basicos',
    slug: 'basicos',
    name: 'Basicos',
    description: 'Prendas esenciales en colores neutros, perfectas para combinar.',
    image: UNSPLASH.categories[4],
    productCount: 15,
  },
  {
    id: 'liquidacion',
    slug: 'liquidacion',
    name: 'Liquidacion',
    description: 'Ultimas unidades con descuentos especiales. Stock limitado.',
    image: UNSPLASH.categories[5],
    productCount: 22,
  },
];

/**
 * Productos de ejemplo
 */
export const products: Product[] = [
  {
    id: 'prod-001',
    slug: 'remera-dragon-spirit-oversize',
    name: 'Remera Dragon Spirit Oversize',
    description: 'Remera oversize con estampado de dragon japones en la espalda. Confeccionada en algodon premium 24/1 de 180 gsm. El diseno combina elementos tradicionales japoneses con estetica urbana moderna. Ideal para quienes buscan destacar con un look unico y autentico.',
    shortDescription: 'Remera oversize con dragon japones estampado.',
    price: 44900,
    originalPrice: 52900,
    discount: 15,
    images: [
      { id: 'img-001-1', url: UNSPLASH.remeras[0], alt: 'Remera Dragon Spirit - Frente', isPrimary: true },
      { id: 'img-001-2', url: UNSPLASH.remeras[1], alt: 'Remera Dragon Spirit - Espalda', isPrimary: false },
      { id: 'img-001-3', url: UNSPLASH.remeras[2], alt: 'Remera Dragon Spirit - Detalle', isPrimary: false },
    ],
    category: categories[0],
    subcategory: 'oversize',
    tags: ['dragon', 'japanese', 'oversize', 'bestseller'],
    sizes: [
      { id: 's', name: 'S', measurements: { width: 57, length: 70, sleeve: 26 } },
      { id: 'm', name: 'M', measurements: { width: 60, length: 73, sleeve: 27 } },
      { id: 'l', name: 'L', measurements: { width: 62, length: 76, sleeve: 28 } },
      { id: 'xl', name: 'XL', measurements: { width: 63, length: 78, sleeve: 29 } },
      { id: 'xxl', name: 'XXL', measurements: { width: 65, length: 80, sleeve: 30 } },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
      { id: 'blanco', name: 'Blanco', hexCode: '#ffffff' },
    ],
    stock: {
      's-negro': 15,
      'm-negro': 22,
      'l-negro': 18,
      'xl-negro': 12,
      'xxl-negro': 8,
      's-blanco': 10,
      'm-blanco': 15,
      'l-blanco': 12,
      'xl-blanco': 8,
      'xxl-blanco': 5,
    },
    sku: 'REM-DRG-001',
    featured: true,
    isNew: true,
    isOnSale: true,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'prod-002',
    slug: 'hoodie-kitsune-revenge',
    name: 'Hoodie Kitsune Revenge',
    description: 'Hoodie premium con estampado de kitsune (zorro de nueve colas) en la espalda. Fabricado en french terry de 320 gsm, con capucha doble, bolsillo canguro y punos con rib. El diseno representa la venganza del espiritu zorro de la mitologia japonesa.',
    shortDescription: 'Hoodie con kitsune estampado, french terry 320gsm.',
    price: 78000,
    originalPrice: undefined,
    discount: undefined,
    images: [
      { id: 'img-002-1', url: UNSPLASH.hoodies[0], alt: 'Hoodie Kitsune - Frente', isPrimary: true },
      { id: 'img-002-2', url: UNSPLASH.hoodies[1], alt: 'Hoodie Kitsune - Espalda', isPrimary: false },
    ],
    category: categories[1],
    subcategory: 'oversize',
    tags: ['kitsune', 'japanese', 'hoodie', 'premium'],
    sizes: [
      { id: 's', name: 'S', measurements: { width: 60, length: 70, sleeve: 65 } },
      { id: 'm', name: 'M', measurements: { width: 63, length: 73, sleeve: 67 } },
      { id: 'l', name: 'L', measurements: { width: 66, length: 76, sleeve: 69 } },
      { id: 'xl', name: 'XL', measurements: { width: 69, length: 79, sleeve: 71 } },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
    ],
    stock: {
      's-negro': 8,
      'm-negro': 15,
      'l-negro': 12,
      'xl-negro': 6,
    },
    sku: 'HOO-KIT-001',
    featured: true,
    isNew: false,
    isOnSale: false,
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-12-05T00:00:00Z',
  },
  {
    id: 'prod-003',
    slug: 'short-cargo-shogun',
    name: 'Short Cargo Shogun',
    description: 'Short cargo de gabardina con multiples bolsillos laterales. Corte oversize con cintura elastizada y cordon ajustable. Perfecto para el verano con un estilo militar japones.',
    shortDescription: 'Short cargo gabardina, multiples bolsillos.',
    price: 34000,
    originalPrice: undefined,
    discount: undefined,
    images: [
      { id: 'img-003-1', url: UNSPLASH.pants[0], alt: 'Short Cargo Shogun - Frente', isPrimary: true },
      { id: 'img-003-2', url: UNSPLASH.pants[1], alt: 'Short Cargo Shogun - Lateral', isPrimary: false },
    ],
    category: categories[2],
    subcategory: 'shorts',
    tags: ['cargo', 'shorts', 'summer', 'military'],
    sizes: [
      { id: 's', name: 'S', measurements: { waist: 32, length: 43 } },
      { id: 'm', name: 'M', measurements: { waist: 34, length: 44 } },
      { id: 'l', name: 'L', measurements: { waist: 36, length: 45 } },
      { id: 'xl', name: 'XL', measurements: { waist: 38, length: 45 } },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
      { id: 'beige', name: 'Beige', hexCode: '#d4a574' },
    ],
    stock: {
      's-negro': 20,
      'm-negro': 25,
      'l-negro': 18,
      'xl-negro': 10,
      's-beige': 12,
      'm-beige': 15,
      'l-beige': 10,
      'xl-beige': 6,
    },
    sku: 'SHO-CAR-001',
    featured: true,
    isNew: false,
    isOnSale: false,
    createdAt: '2024-10-20T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'prod-004',
    slug: 'remera-neko-mafia-boss',
    name: 'Remera Neko Mafia Boss',
    description: 'Remera con ilustracion de gato yakuza fumando. Diseno exclusivo con estetica neo-tokyo. Algodon peinado 24/1, corte oversize.',
    shortDescription: 'Remera neko yakuza, diseno exclusivo.',
    price: 44900,
    originalPrice: undefined,
    discount: undefined,
    images: [
      { id: 'img-004-1', url: UNSPLASH.remeras[3], alt: 'Remera Neko Mafia Boss - Frente', isPrimary: true },
    ],
    category: categories[0],
    subcategory: 'oversize',
    tags: ['neko', 'cat', 'yakuza', 'japanese'],
    sizes: [
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
      { id: 'xxl', name: 'XXL' },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
    ],
    stock: {
      's-negro': 10,
      'm-negro': 18,
      'l-negro': 15,
      'xl-negro': 12,
      'xxl-negro': 8,
    },
    sku: 'REM-NEK-001',
    featured: false,
    isNew: true,
    isOnSale: false,
    createdAt: '2024-12-05T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'prod-005',
    slug: 'remera-washed-alternative',
    name: 'Remera Washed Alternative',
    description: 'Remera con lavado acido para un efecto vintage. Sin estampado, perfecta como basico premium. Corte oversize.',
    shortDescription: 'Remera washed, efecto vintage.',
    price: 38000,
    originalPrice: 44900,
    discount: 15,
    images: [
      { id: 'img-005-1', url: UNSPLASH.remeras[4], alt: 'Remera Washed Alternative', isPrimary: true },
    ],
    category: categories[4],
    subcategory: 'basicos',
    tags: ['washed', 'vintage', 'basic', 'oversize'],
    sizes: [
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
    ],
    colors: [
      { id: 'gris', name: 'Gris Washed', hexCode: '#6b7280' },
      { id: 'negro', name: 'Negro Washed', hexCode: '#1f2937' },
    ],
    stock: {
      's-gris': 8,
      'm-gris': 12,
      'l-gris': 10,
      'xl-gris': 6,
      's-negro': 10,
      'm-negro': 15,
      'l-negro': 12,
      'xl-negro': 8,
    },
    sku: 'REM-WAS-001',
    featured: true,
    isNew: false,
    isOnSale: true,
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-12-08T00:00:00Z',
  },
  {
    id: 'prod-006',
    slug: 'remera-disconnection-japanese',
    name: 'Remera Disconnection Japanese',
    description: 'Remera con arte de desconexion digital. Caracteres japoneses y glitch art. Perfecta para quienes buscan expresar la dualidad entre lo tradicional y lo digital.',
    shortDescription: 'Remera con arte glitch japones.',
    price: 40410,
    originalPrice: 44900,
    discount: 10,
    images: [
      { id: 'img-006-1', url: UNSPLASH.remeras[5], alt: 'Remera Disconnection', isPrimary: true },
    ],
    category: categories[0],
    subcategory: 'oversize',
    tags: ['glitch', 'digital', 'japanese', 'art'],
    sizes: [
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
      { id: 'xxl', name: 'XXL' },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
    ],
    stock: {
      's-negro': 12,
      'm-negro': 20,
      'l-negro': 18,
      'xl-negro': 10,
      'xxl-negro': 6,
    },
    sku: 'REM-DIS-001',
    featured: false,
    isNew: false,
    isOnSale: true,
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-05T00:00:00Z',
  },
  {
    id: 'prod-007',
    slug: 'buzo-neko-mafia-boss',
    name: 'Buzo Neko Mafia Boss',
    description: 'Version buzo del popular diseno Neko Mafia Boss. French terry 320gsm, capucha doble, bolsillo canguro.',
    shortDescription: 'Buzo con el iconico neko yakuza.',
    price: 78000,
    originalPrice: undefined,
    discount: undefined,
    images: [
      { id: 'img-007-1', url: UNSPLASH.hoodies[2], alt: 'Buzo Neko Mafia Boss', isPrimary: true },
    ],
    category: categories[1],
    subcategory: 'hoodies',
    tags: ['neko', 'cat', 'hoodie', 'bestseller'],
    sizes: [
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
    ],
    colors: [
      { id: 'negro', name: 'Negro', hexCode: '#0a0a0a' },
    ],
    stock: {
      's-negro': 6,
      'm-negro': 10,
      'l-negro': 8,
      'xl-negro': 5,
    },
    sku: 'BUZ-NEK-001',
    featured: true,
    isNew: true,
    isOnSale: false,
    createdAt: '2024-12-08T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'prod-008',
    slug: 'remera-meiyo-beige',
    name: 'Remera Meiyo Beige',
    description: 'Remera en tono beige con caracteres japoneses que significan "honor". Diseno minimalista con detalles bordados.',
    shortDescription: 'Remera beige con kanji de honor.',
    price: 44900,
    originalPrice: undefined,
    discount: undefined,
    images: [
      { id: 'img-008-1', url: UNSPLASH.remeras[0], alt: 'Remera Meiyo Beige', isPrimary: true },
    ],
    category: categories[0],
    subcategory: 'oversize',
    tags: ['kanji', 'minimalist', 'beige', 'embroidery'],
    sizes: [
      { id: 's', name: 'S' },
      { id: 'm', name: 'M' },
      { id: 'l', name: 'L' },
      { id: 'xl', name: 'XL' },
    ],
    colors: [
      { id: 'beige', name: 'Beige', hexCode: '#d4a574' },
    ],
    stock: {
      's-beige': 8,
      'm-beige': 12,
      'l-beige': 10,
      'xl-beige': 6,
    },
    sku: 'REM-MEI-001',
    featured: false,
    isNew: true,
    isOnSale: false,
    createdAt: '2024-12-03T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
  },
];

/**
 * Slides del banner principal
 */
export const bannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'Nueva Coleccion',
    subtitle: 'Descubri lo ultimo en streetwear japones',
    image: UNSPLASH.banners[0],
    mobileImage: UNSPLASH.banners[0],
    link: '/productos?filter=new',
    buttonText: 'Ver Novedades',
  },
  {
    id: 'slide-2',
    title: 'Hoodies Premium',
    subtitle: 'French Terry 320gsm - Maxima calidad',
    image: UNSPLASH.banners[1],
    mobileImage: UNSPLASH.banners[1],
    link: '/categoria/hoodies',
    buttonText: 'Explorar',
  },
  {
    id: 'slide-3',
    title: 'Hasta 50% OFF',
    subtitle: 'Liquidacion de temporada',
    image: UNSPLASH.banners[2],
    mobileImage: UNSPLASH.banners[2],
    link: '/categoria/liquidacion',
    buttonText: 'Ver Ofertas',
  },
];

/**
 * Anuncios para la cinta superior
 */
export const announcements: Announcement[] = [
  { id: 'ann-1', text: 'ENVIOS GRATIS A TODO EL PAIS EN COMPRAS MAYORES A $150.000', isActive: true },
  { id: 'ann-2', text: '3 Y 6 CUOTAS SIN INTERES CON TODAS LAS TARJETAS', isActive: true },
  { id: 'ann-3', text: '25% OFF PAGANDO POR TRANSFERENCIA', isActive: true },
  { id: 'ann-4', text: '30% OFF RETIRANDO EN NUESTRO LOCAL', isActive: true },
  { id: 'ann-5', text: 'NUEVA COLECCION DISPONIBLE', link: '/productos?filter=new', isActive: true },
];

/**
 * Obtiene productos destacados
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

/**
 * Obtiene productos en oferta
 */
export function getSaleProducts(): Product[] {
  return products.filter((p) => p.isOnSale);
}

/**
 * Obtiene productos nuevos
 */
export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

/**
 * Obtiene un producto por slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Obtiene productos por categoria
 */
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category.slug === categorySlug);
}

/**
 * Obtiene una categoria por slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/**
 * Obtiene productos relacionados
 */
export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  return products
    .filter((p) => p.id !== productId && p.category.id === product.category.id)
    .slice(0, limit);
}
