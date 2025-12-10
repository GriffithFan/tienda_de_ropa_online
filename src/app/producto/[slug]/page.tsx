'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCcw,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice, calculateTransferPrice, cn } from '@/lib/utils';
import { PAYMENT_CONFIG, SHIPPING_CONFIG } from '@/lib/constants';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  images: string[];
  sizes: { size: string; stock: number }[];
  colors: { name: string; hexCode: string }[];
  category: { id: string; name: string; slug: string };
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  stock: number;
}

/**
 * Pagina de detalle de producto
 * Muestra toda la informacion del producto con opciones de compra
 */
export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [postalCode, setPostalCode] = useState('');

  // Cargar producto desde la API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="section-title mb-4">Producto no encontrado</h1>
          <p className="text-accent-muted mb-6">
            El producto que buscas no existe o fue eliminado.
          </p>
          <Link href="/productos" className="btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  const transferPrice = calculateTransferPrice(product.price, PAYMENT_CONFIG.transferDiscount);
  const installmentPrice = Math.round(product.price / 6);

  // Si no hay colores, usar "Default" como color predeterminado
  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  
  // Auto-seleccionar si solo hay una opción
  const effectiveColor = hasColors ? selectedColor : 'default';
  const effectiveSize = hasSizes ? selectedSize : 'unico';

  const handleAddToCart = () => {
    // Permitir agregar si no requiere selección o si ya está seleccionado
    const needsSize = hasSizes && !selectedSize;
    const needsColor = hasColors && !selectedColor;
    
    if (needsSize || needsColor) {
      alert(needsSize && needsColor ? 'Selecciona talle y color' : needsSize ? 'Selecciona un talle' : 'Selecciona un color');
      return;
    }
    
    // Adaptar el producto al formato esperado por el carrito
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cartProduct: any = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.compareAtPrice,
      images: product.images.map((url, i) => ({ id: `img-${i}`, url, alt: product.name })),
      sizes: hasSizes 
        ? product.sizes.map((s, i) => ({ id: `size-${i}`, name: s.size, available: s.stock > 0 }))
        : [{ id: 'size-0', name: 'Único', available: true }],
      colors: hasColors
        ? product.colors.map((c) => ({ id: c.name.toLowerCase(), name: c.name, hexCode: c.hexCode }))
        : [{ id: 'default', name: 'Default', hexCode: '#000000' }],
      category: product.category,
      tags: product.tags,
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      featured: product.isFeatured,
      stock: {},
      sku: product.sku || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addItem(cartProduct, quantity, effectiveSize, effectiveColor);
  };

  const getStockForSize = (sizeName: string) => {
    const size = product.sizes.find(s => s.size === sizeName);
    return size?.stock || 0;
  };

  const currentStock = selectedSize ? getStockForSize(selectedSize) : null;
  const isOutOfStock = currentStock !== null && currentStock === 0;
  const currentImage = product.images[activeImage] || product.images[0];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-accent-muted overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href="/productos" className="hover:text-accent">
              Productos
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              href={`/categoria/${product.category?.slug || 'general'}`}
              className="hover:text-accent"
            >
              {product.category?.name || 'General'}
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-accent truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galeria de imagenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-product bg-surface rounded-xl overflow-hidden relative">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-primary-700" />
                </div>
              )}

              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <span className="tag-new">Nuevo</span>}
                {product.isOnSale && product.compareAtPrice && (
                  <span className="tag-sale">
                    {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
                  aria-label="Agregar a favoritos"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
                  aria-label="Compartir"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      'w-20 h-24 flex-shrink-0 bg-surface rounded-lg overflow-hidden border-2 transition-colors relative',
                      activeImage === index
                        ? 'border-accent'
                        : 'border-transparent hover:border-border'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informacion del producto */}
          <div className="space-y-6">
            {/* Categoria y nombre */}
            <div>
              <p className="text-sm text-accent-muted uppercase tracking-wider mb-2">
                {product.category?.name || 'General'}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-accent-muted text-sm mt-2">SKU: {product.sku}</p>
              )}
            </div>

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="price text-3xl">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="price-original text-lg">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="text-success font-medium">
                {formatPrice(transferPrice)} con transferencia (
                {PAYMENT_CONFIG.transferDiscount}% OFF)
              </p>
              <p className="text-accent-muted text-sm">
                6 cuotas sin interes de {formatPrice(installmentPrice)}
              </p>
            </div>

            <div className="divider" />

            {/* Selector de color */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Color: <span className="text-accent-muted">{selectedColor || 'Selecciona'}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all',
                        selectedColor === color.name
                          ? 'border-accent scale-110'
                          : 'border-border hover:border-accent-muted'
                      )}
                      style={{ backgroundColor: color.hexCode }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Selector de talle */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">
                    Talle: <span className="text-accent-muted">{selectedSize || 'Selecciona'}</span>
                  </label>
                  <Link
                    href="/guia-de-talles"
                    className="text-sm text-accent-muted hover:text-accent underline"
                  >
                    Guia de talles
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock === 0}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
                        selectedSize === size.size
                          ? 'bg-accent text-background border-accent'
                          : size.stock === 0
                          ? 'border-border opacity-50 cursor-not-allowed line-through'
                          : 'border-border hover:border-accent-muted'
                      )}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {currentStock !== null && (
              <p
                className={cn(
                  'text-sm font-medium',
                  currentStock > 5 ? 'text-success' : currentStock > 0 ? 'text-warning' : 'text-error'
                )}
              >
                {currentStock > 5
                  ? 'Stock disponible'
                  : currentStock > 0
                  ? `Ultimas ${currentStock} unidades`
                  : 'Sin stock'}
              </p>
            )}

            {/* Cantidad y agregar al carrito */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Selector de cantidad */}
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-surface transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-3 hover:bg-surface transition-colors"
                  disabled={quantity >= 10 || (currentStock !== null && quantity >= currentStock)}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Boton agregar */}
              <button
                onClick={handleAddToCart}
                disabled={(hasSizes && !selectedSize) || (hasColors && !selectedColor) || isOutOfStock}
                className="btn-primary flex-1 justify-center"
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>

            {/* Calculador de envio */}
            <div className="card p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Calcular costo de envio
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Tu codigo postal"
                  className="flex-1"
                  maxLength={8}
                />
                <button className="btn-secondary">Calcular</button>
              </div>
              <p className="text-xs text-accent-muted mt-2">
                Envio gratis en compras mayores a{' '}
                {formatPrice(SHIPPING_CONFIG.freeShippingThreshold)}
              </p>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-success" />
                <span>Compra segura</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCcw className="w-5 h-5 text-success" />
                <span>Cambios gratis</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-success" />
                <span>Envio a todo el pais</span>
              </div>
            </div>

            <div className="divider" />

            {/* Descripcion */}
            <div>
              <h2 className="font-display font-bold text-lg mb-3">Descripcion</h2>
              <p className="text-accent-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-surface rounded-full text-accent-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
