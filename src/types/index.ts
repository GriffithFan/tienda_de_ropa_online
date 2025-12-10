/**
 * Definiciones de tipos globales para la tienda
 * Centraliza todas las interfaces y types del proyecto
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  discount?: number;
  images: ProductImage[];
  category: Category;
  subcategory?: string;
  tags: string[];
  sizes: Size[];
  colors: Color[];
  stock: Record<string, number>;
  sku: string;
  featured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Size {
  id: string;
  name: string;
  measurements?: SizeMeasurement;
}

export interface SizeMeasurement {
  width?: number;
  length: number;
  sleeve?: number;
  waist?: number;
}

export interface Color {
  id: string;
  name: string;
  hexCode: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'mercadopago'
  | 'transfer'
  | 'cash';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: string;
}

export interface ShippingRate {
  postalCode: string;
  methods: ShippingMethod[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  onSale: boolean;
  inStock: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationState;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link: string;
  buttonText?: string;
}

export interface Announcement {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SizeGuide {
  category: string;
  type: string;
  sizes: SizeGuideEntry[];
}

export interface SizeGuideEntry {
  size: string;
  width: number;
  length: number;
  sleeve?: number;
  waist?: number;
}
