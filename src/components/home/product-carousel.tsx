'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/products';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

/**
 * Carrusel horizontal de productos
 * Con controles de navegacion y scroll suave
 */
export function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllLink,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollability();
    container.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && (
              <p className="section-subtitle mt-2">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation buttons */}
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full border border-border transition-all',
                canScrollLeft
                  ? 'hover:bg-surface hover:border-accent-muted'
                  : 'opacity-30 cursor-not-allowed'
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full border border-border transition-all',
                canScrollRight
                  ? 'hover:bg-surface hover:border-accent-muted'
                  : 'opacity-30 cursor-not-allowed'
              )}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products carousel */}
        <div className="relative -mx-4 px-4">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mb-4"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Gradient fade on edges */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          )}
        </div>

        {/* View all link */}
        {viewAllLink && (
          <div className="text-center mt-8">
            <a
              href={viewAllLink}
              className="btn-outline"
            >
              Ver todos
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
