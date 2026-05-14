'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

/**
 * Grid de categorias destacadas
 * Con efecto hover y enlaces a cada categoria
 */
export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="container-custom">
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-brand-gold uppercase mb-2">Explora por estilo</p>
            <h2 className="section-title">Categorias</h2>
          </div>
          <div className="hidden sm:block h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {categories.slice(0, 6).map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: Category;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/categoria/${category.slug}`}
        className="group block relative aspect-[3/4] sm:aspect-category overflow-hidden rounded-lg border border-border bg-surface shadow-inner-light"
      >
        {/* Background image */}
        <Image
          src={category.image || ''}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-3 sm:p-6 text-left">
          <h3 className="font-display text-base sm:text-2xl lg:text-3xl font-bold uppercase mb-2 sm:mb-4">
            {category.name}
          </h3>
          <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-accent/70 rounded-full bg-background/20 backdrop-blur-sm group-hover:bg-accent group-hover:text-background transition-all duration-300">
            Ver todos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Product count badge */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-background/65 border border-accent/10 backdrop-blur-sm rounded-full">
          {category.productCount}
        </div>
      </Link>
    </motion.div>
  );
}
