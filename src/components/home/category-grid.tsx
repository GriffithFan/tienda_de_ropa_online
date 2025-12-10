'use client';

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
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        <h2 className="section-title text-center mb-8">Categorias</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
        className="group block relative aspect-category overflow-hidden rounded-xl"
      >
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950 transition-transform duration-500 group-hover:scale-105" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase tracking-wider mb-4">
            {category.name}
          </h3>
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-accent rounded-full group-hover:bg-accent group-hover:text-background transition-all duration-300">
            Ver todos los disenos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Product count badge */}
        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-background/50 backdrop-blur-sm rounded-full">
          {category.productCount} productos
        </div>
      </Link>
    </motion.div>
  );
}
