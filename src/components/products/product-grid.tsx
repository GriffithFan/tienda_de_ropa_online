'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * Grid de productos con carga infinita
 * Muestra productos en 4 columnas con lazy loading
 */
export function ProductGrid({
  products,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: ProductGridProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Intersection Observer para carga infinita
  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore?.();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-surface mb-4">
          <svg
            className="w-10 h-10 text-accent-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="font-display font-bold text-lg mb-2">
          No hay productos
        </h3>
        <p className="text-accent-muted text-sm max-w-sm">
          No encontramos productos con los filtros seleccionados. Intenta
          modificar tu busqueda.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                priority={index < 4}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
          {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Trigger para carga infinita */}
      {hasMore && (
        <div ref={observerRef} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton loader para producto
 */
function ProductSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-product bg-surface" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-surface rounded w-1/3" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-2/3" />
        <div className="h-5 bg-surface rounded w-1/2" />
      </div>
    </div>
  );
}
