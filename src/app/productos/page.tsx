'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid, ProductFilters } from '@/components/products';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12;

  // Función para obtener productos de la API
  const fetchProducts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('limit', productsPerPage.toString());
      params.set('sort', sortBy);
      
      if (searchQuery) {
        params.set('search', searchQuery);
      }
      
      if (filters.sizes.length > 0) {
        params.set('size', filters.sizes[0]); // API acepta un talle a la vez
      }
      
      if (filters.colors.length > 0) {
        params.set('color', filters.colors[0]); // API acepta un color a la vez
      }
      
      if (filters.priceRange[0] > 0) {
        params.set('minPrice', filters.priceRange[0].toString());
      }
      
      if (filters.priceRange[1] < 200000) {
        params.set('maxPrice', filters.priceRange[1].toString());
      }
      
      if (filters.onSale) {
        params.set('onSale', 'true');
      }
      
      if (initialFilter === 'featured') {
        params.set('featured', 'true');
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        // Mapear los datos de la API al formato esperado por el frontend
        const mappedProducts: Product[] = (data.products || []).map((p: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          compareAtPrice?: number | null;
          images: string[];
          sizes: { size: string; stock: number }[];
          colors: { name: string; hexCode: string }[];
          category?: { id: string; name: string; slug: string } | null;
          tags: string[];
          isFeatured: boolean;
          isOnSale: boolean;
          isNew: boolean;
          isActive: boolean;
          createdAt: string;
        }) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          originalPrice: p.compareAtPrice || undefined,
          images: p.images || [],
          sizes: (p.sizes || []).map((s: { size: string; stock: number }) => ({
            name: s.size,
            available: s.stock > 0,
            stock: s.stock,
          })),
          colors: (p.colors || []).map((c: { name: string; hexCode: string }) => ({
            id: c.name.toLowerCase(),
            name: c.name,
            hex: c.hexCode,
          })),
          category: p.category?.slug || 'general',
          tags: p.tags || [],
          featured: p.isFeatured,
          isNew: p.isNew,
          isOnSale: p.isOnSale,
          createdAt: p.createdAt,
        }));
        
        if (append) {
          setProducts(prev => [...prev, ...mappedProducts]);
        } else {
          setProducts(mappedProducts);
        }
        setTotalProducts(data.pagination?.total || mappedProducts.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery, filters, initialFilter, productsPerPage]);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Cargar mas productos
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const hasMore = products.length < totalProducts;

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
              {totalProducts} resultado
              {totalProducts !== 1 && 's'} encontrado
              {totalProducts !== 1 && 's'}
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
            totalProducts={totalProducts}
          />

          {/* Grid de productos */}
          <div className="flex-1 min-w-0">
            {/* Barra superior con ordenamiento */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="text-sm text-accent-muted">
                {loading ? 'Cargando...' : `${totalProducts} producto${totalProducts !== 1 ? 's' : ''}`}
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
            
            {loading && products.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-accent-muted text-lg">No se encontraron productos</p>
                <p className="text-accent-muted/60 mt-2">Intenta ajustar los filtros</p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
