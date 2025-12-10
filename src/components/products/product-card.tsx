'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { useCartStore } from '@/store';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

/**
 * Card de producto para listados
 * Incluye imagen, nombre, precio, tags y acciones rapidas
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Soportar ambos formatos de images: array de objetos o array de strings
  const getImageUrl = (img: { url?: string; isPrimary?: boolean } | string): string => {
    if (typeof img === 'string') return img;
    return img.url || '';
  };

  const images = product.images || [];
  const primaryImage = images.length > 0 ? getImageUrl(images[0]) : null;
  const secondaryImage = images.length > 1 ? getImageUrl(images[1]) : null;

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Agregar con talle y color por defecto
    const defaultSize = product.sizes?.[0]?.name || 'M';
    const defaultColor = product.colors?.[0]?.name || 'Negro';
    addItem(product, 1, defaultSize, defaultColor);
  };

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-hover"
      >
        {/* Contenedor de imagen */}
        <div className="relative aspect-product overflow-hidden bg-surface">
          {/* Imagen principal */}
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            )}
          >
            {primaryImage && !imageError ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-900">
                <ShoppingBag className="w-16 h-16 text-primary-700" />
              </div>
            )}
          </div>

          {/* Imagen secundaria (hover) */}
          {secondaryImage && (
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-300',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Image
                src={secondaryImage}
                alt={`${product.name} - alternativa`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          )}

          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="tag-new">Nuevo</span>
            )}
            {product.isOnSale && discount > 0 && (
              <span className="tag-sale">{discount}% OFF</span>
            )}
          </div>

          {/* Acciones rapidas */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-3 flex items-center justify-center gap-2 bg-gradient-to-t from-background/80 to-transparent transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <button
              onClick={handleQuickAdd}
              className="flex-1 btn-primary btn-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Agregar a favoritos
              }}
              className="btn-secondary btn-sm px-3"
              aria-label="Agregar a favoritos"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informacion del producto */}
        <div className="p-4">
          {/* Categoria */}
          <p className="text-xs text-accent-muted uppercase tracking-wider mb-1">
            {typeof product.category === 'string' ? product.category : product.category?.name || 'General'}
          </p>

          {/* Nombre */}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-accent-muted transition-colors mb-2">
            {product.name}
          </h3>

          {/* Precios */}
          <div className="flex items-baseline gap-2">
            <span className="price text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Precio con transferencia */}
          <p className="text-xs text-success mt-1">
            {formatPrice(Math.round(product.price * 0.75))} con transferencia
          </p>

          {/* Cuotas */}
          <p className="text-xs text-accent-muted mt-1">
            6 cuotas sin interes de {formatPrice(Math.round(product.price / 6))}
          </p>

          {/* Colores disponibles */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-3">
              {product.colors.slice(0, 4).map((color, idx) => (
                <span
                  key={color.id || idx}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hexCode || color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-accent-muted">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
