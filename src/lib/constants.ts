/**
 * Constantes globales de la aplicacion
 * Centraliza valores que se usan en multiples lugares
 */

export const SITE_CONFIG = {
  name: 'KURO',
  tagline: 'Ropa Alternativa & Japanese Streetwear',
  description: 'Tienda online de ropa alternativa con estilo japones. Remeras, hoodies, pants y accesorios con disenos unicos.',
  url: 'https://kuro.com.ar',
  email: 'contacto@kuro.com.ar',
  phone: '+54 11 1234-5678',
  whatsapp: '5491112345678',
  address: {
    street: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    province: 'CABA',
    postalCode: '1043',
    country: 'Argentina',
  },
  social: {
    instagram: 'https://instagram.com/kuro.streetwear',
    tiktok: 'https://tiktok.com/@kuro.streetwear',
    twitter: 'https://twitter.com/kuro_streetwear',
  },
} as const;

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 150000,
  carriers: [
    { id: 'andreani', name: 'Andreani', logo: '/images/carriers/andreani.png' },
    { id: 'correo-argentino', name: 'Correo Argentino', logo: '/images/carriers/correo-argentino.png' },
    { id: 'oca', name: 'OCA', logo: '/images/carriers/oca.png' },
  ],
  estimatedDays: {
    caba: '24-48 hs',
    gba: '48-72 hs',
    interior: '3-7 dias',
  },
} as const;

export const PAYMENT_CONFIG = {
  transferDiscount: 25,
  cashDiscount: 30,
  installments: [3, 6],
  methods: [
    { id: 'mercadopago', name: 'MercadoPago', icon: 'mercadopago' },
    { id: 'visa', name: 'Visa', icon: 'visa' },
    { id: 'mastercard', name: 'Mastercard', icon: 'mastercard' },
    { id: 'amex', name: 'American Express', icon: 'amex' },
    { id: 'transfer', name: 'Transferencia Bancaria', icon: 'bank' },
  ],
  transferInfo: {
    bank: 'Banco Galicia',
    cbu: '0070999030004123456789',
    alias: 'KURO.STREETWEAR',
    holder: 'KURO S.R.L.',
    cuit: '30-12345678-9',
  },
} as const;

export const CATEGORIES = [
  { id: 'remeras', slug: 'remeras', name: 'Remeras', icon: 'shirt' },
  { id: 'hoodies', slug: 'hoodies', name: 'Hoodies', icon: 'hoodie' },
  { id: 'pants', slug: 'pants-shorts', name: 'Pants & Shorts', icon: 'pants' },
  { id: 'accesorios', slug: 'accesorios', name: 'Accesorios', icon: 'accessory' },
  { id: 'basicos', slug: 'basicos', name: 'Basicos', icon: 'basic' },
  { id: 'liquidacion', slug: 'liquidacion', name: 'Liquidacion', icon: 'sale' },
] as const;

export const SIZES = {
  remeras: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  hoodies: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  pants: ['28', '30', '32', '34', '36', '38', '40'],
  shorts: ['S', 'M', 'L', 'XL', 'XXL'],
} as const;

export const COLORS = [
  { id: 'negro', name: 'Negro', hex: '#0a0a0a' },
  { id: 'blanco', name: 'Blanco', hex: '#ffffff' },
  { id: 'gris', name: 'Gris', hex: '#6b7280' },
  { id: 'rojo', name: 'Rojo', hex: '#dc2626' },
  { id: 'azul', name: 'Azul', hex: '#2563eb' },
  { id: 'verde', name: 'Verde', hex: '#16a34a' },
  { id: 'violeta', name: 'Violeta', hex: '#7c3aed' },
  { id: 'rosa', name: 'Rosa', hex: '#ec4899' },
  { id: 'beige', name: 'Beige', hex: '#d4a574' },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mas nuevo' },
  { value: 'oldest', label: 'Mas viejo' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'name-asc', label: 'A - Z' },
  { value: 'name-desc', label: 'Z - A' },
  { value: 'popular', label: 'Mas popular' },
] as const;

export const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'warning' },
  confirmed: { label: 'Confirmado', color: 'info' },
  processing: { label: 'Preparando', color: 'info' },
  shipped: { label: 'Enviado', color: 'success' },
  delivered: { label: 'Entregado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
} as const;

export const ANNOUNCEMENTS = [
  'ENVIOS GRATIS A TODO EL PAIS EN COMPRAS MAYORES A $150.000',
  '3 Y 6 CUOTAS SIN INTERES CON TODAS LAS TARJETAS',
  '25% OFF PAGANDO POR TRANSFERENCIA',
  '30% OFF PAGANDO EN EFECTIVO AL RETIRAR',
  'NUEVA COLECCION DISPONIBLE',
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorias', hasDropdown: true },
  { href: '/ofertas', label: 'Ofertas' },
  { href: '/guia-de-talles', label: 'Guia de Talles' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export const FOOTER_LINKS = {
  categories: [
    { href: '/categoria/remeras', label: 'Remeras' },
    { href: '/categoria/hoodies', label: 'Hoodies' },
    { href: '/categoria/pants-shorts', label: 'Pants & Shorts' },
    { href: '/categoria/accesorios', label: 'Accesorios' },
    { href: '/categoria/basicos', label: 'Basicos' },
    { href: '/categoria/liquidacion', label: 'Liquidacion' },
  ],
  info: [
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/guia-de-talles', label: 'Guia de Talles' },
    { href: '/preguntas-frecuentes', label: 'Preguntas Frecuentes' },
    { href: '/politica-de-privacidad', label: 'Politica de Privacidad' },
    { href: '/terminos-y-condiciones', label: 'Terminos y Condiciones' },
  ],
} as const;

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

export const PRODUCTS_PER_PAGE = 12;
export const RELATED_PRODUCTS_COUNT = 8;
export const MAX_CART_QUANTITY = 10;
