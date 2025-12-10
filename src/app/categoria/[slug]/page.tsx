'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductGrid, ProductFilters } from '@/components/products';
import type { FilterState, Product } from '@/types';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

/**
 * Pagina de categoria individual
 * Muestra productos de una categoria especifica con filtros
 */
export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 200000],
    onSale: false,
    inStock: true,
  });

  const [sortBy, setSortBy] = useState('newest');
  const productsPerPage = 12;

  // Cargar categoría y productos
  const fetchData = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      
      // Construir query params
      const queryParams = new URLSearchParams();
      queryParams.set('category', slug);
      queryParams.set('page', pageNum.toString());
      queryParams.set('limit', productsPerPage.toString());
      queryParams.set('sort', sortBy);
      
      if (filters.sizes.length > 0) {
        queryParams.set('size', filters.sizes[0]);
      }
      
      if (filters.colors.length > 0) {
        queryParams.set('color', filters.colors[0]);
      }
      
      if (filters.priceRange[0] > 0) {
        queryParams.set('minPrice', filters.priceRange[0].toString());
      }
      
      if (filters.priceRange[1] < 200000) {
        queryParams.set('maxPrice', filters.priceRange[1].toString());
      }
      
      if (filters.onSale) {
        queryParams.set('onSale', 'true');
      }

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        // Mapear productos
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedProducts: Product[] = (data.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          originalPrice: p.compareAtPrice || undefined,
          images: (p.images || []).map((url: string, i: number) => ({ id: `img-${i}`, url, alt: p.name })),
          sizes: (p.sizes || []).map((s: { size: string; stock: number }, i: number) => ({
            id: `size-${i}`,
            name: s.size,
            available: s.stock > 0,
          })),
          colors: (p.colors || []).map((c: { name: string; hexCode: string }) => ({
            id: c.name.toLowerCase(),
            name: c.name,
            hexCode: c.hexCode,
          })),
          category: p.category || { id: 'general', name: 'General', slug: 'general' },
          tags: p.tags || [],
          featured: p.isFeatured,
          isNew: p.isNew,
          isOnSale: p.isOnSale,
          stock: {},
          sku: '',
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        }));

        // Extraer categoría del primer producto o buscarla
        if (mappedProducts.length > 0 && mappedProducts[0].category) {
          setCategory(mappedProducts[0].category as CategoryData);
        } else {
          // Buscar la categoría por slug (solo si no tenemos productos)
          const catResponse = await fetch('/api/categories');
          if (catResponse.ok) {
            const catData = await catResponse.json();
            const foundCat = catData.categories?.find((c: CategoryData) => c.slug === slug);
            if (foundCat) {
              setCategory(foundCat);
            }
          }
        }
        
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
  }, [slug, sortBy, filters, productsPerPage]);

  useEffect(() => {
    setPage(1);
    fetchData(1, false);
  }, [slug, sortBy, filters]); // Solo re-ejecutar cuando cambia slug, sort o filtros

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  const hasMore = products.length < totalProducts;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!category && !loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="section-title mb-4">Categoría no encontrada</h1>
          <p className="text-accent-muted mb-6">
            La categoría que buscas no existe o no tiene productos.
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
            <span className="text-accent">{category?.name || slug}</span>
          </nav>

          <h1 className="section-title">{category?.name || slug}</h1>
          {category?.description && (
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
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                </select>
              </div>
            </div>

            {products.length === 0 && !loading ? (
              <div className="text-center py-20">
                <p className="text-accent-muted text-lg">No se encontraron productos en esta categoría</p>
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
