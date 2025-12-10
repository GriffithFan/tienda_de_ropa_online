'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid, ProductFilters } from '@/components/products';
import { products } from '@/data/products';
import type { FilterState, Product } from '@/types';

/**
 * Pagina del catalogo de productos
 * Incluye filtros, ordenamiento y carga infinita
 */
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');
  const searchQuery = searchParams.get('search');

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 200000],
    onSale: initialFilter === 'sale',
    inStock: true,
  });

  const [sortBy, setSortBy] = useState('newest');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro por busqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

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

    // Filtro especial desde URL
    if (initialFilter === 'new') {
      result = result.filter((p) => p.isNew);
    } else if (initialFilter === 'featured') {
      result = result.filter((p) => p.featured);
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
  }, [filters, sortBy, searchQuery, initialFilter]);

  // Inicializar productos mostrados
  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, productsPerPage));
    setPage(1);
  }, [filteredProducts]);

  // Cargar mas productos
  const loadMore = () => {
    const nextPage = page + 1;
    const nextProducts = filteredProducts.slice(0, nextPage * productsPerPage);
    setDisplayedProducts(nextProducts);
    setPage(nextPage);
  };

  const hasMore = displayedProducts.length < filteredProducts.length;

  // Titulo de la pagina basado en filtros
  const getPageTitle = () => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (initialFilter === 'new') return 'Novedades';
    if (initialFilter === 'sale') return 'Ofertas';
    if (initialFilter === 'featured') return 'Productos Destacados';
    return 'Todos los Productos';
  };

  return (
    <div className="min-h-screen">
      {/* Header de la pagina */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <a href="/" className="hover:text-accent">
              Inicio
            </a>
            <span className="mx-2">/</span>
            <span className="text-accent">Productos</span>
          </nav>
          <h1 className="section-title">{getPageTitle()}</h1>
          {searchQuery && (
            <p className="text-accent-muted mt-2">
              {filteredProducts.length} resultado
              {filteredProducts.length !== 1 && 's'} encontrado
              {filteredProducts.length !== 1 && 's'}
            </p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filtros - Desktop */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            totalProducts={filteredProducts.length}
          />

          {/* Grid de productos */}
          <div className="flex-1 min-w-0">
            {/* Barra superior con ordenamiento */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="text-sm text-accent-muted">
                {filteredProducts.length} producto{filteredProducts.length !== 1 && 's'}
              </p>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-accent-muted">
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="newest">Más nuevo</option>
                  <option value="oldest">Más antiguo</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
              </div>
            </div>
            
            <ProductGrid
              products={displayedProducts}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
