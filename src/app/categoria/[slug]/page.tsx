'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductGrid, ProductFilters } from '@/components/products';
import { products, getCategoryBySlug, getProductsByCategory } from '@/data/products';
import type { FilterState } from '@/types';

/**
 * Pagina de categoria individual
 * Muestra productos de una categoria especifica con filtros
 */
export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = getCategoryBySlug(slug);
  const categoryProducts = getProductsByCategory(slug);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 200000],
    onSale: false,
    inStock: true,
  });

  const [sortBy, setSortBy] = useState('newest');

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Filtro por talle
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => filters.sizes.includes(size.name))
      );
    }

    // Filtro por color
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => filters.colors.includes(color.id))
      );
    }

    // Filtro por precio
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtro por ofertas
    if (filters.onSale) {
      result = result.filter((p) => p.isOnSale);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [categoryProducts, filters, sortBy]);

  // Determinar tipo de talle segun categoria
  const getCategoryType = (): 'remeras' | 'hoodies' | 'pants' | 'shorts' => {
    if (slug === 'remeras' || slug === 'basicos') return 'remeras';
    if (slug === 'hoodies') return 'hoodies';
    if (slug === 'pants-shorts') return 'pants';
    return 'remeras';
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="section-title mb-4">Categoria no encontrada</h1>
          <p className="text-accent-muted mb-6">
            La categoria que buscas no existe.
          </p>
          <Link href="/productos" className="btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header de la categoria */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/productos" className="hover:text-accent">
              Productos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">{category.name}</span>
          </nav>

          <h1 className="section-title">{category.name}</h1>
          {category.description && (
            <p className="text-accent-muted mt-2 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filtros */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            currentSort={sortBy}
            totalProducts={filteredProducts.length}
            categoryType={getCategoryType()}
          />

          {/* Grid de productos */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
