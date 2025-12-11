'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useFavoritesStore } from '@/store';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice?: number | null;
  images: (string | { url: string })[];
  category?: { name: string } | null;
}

// Helper para obtener URL de imagen
function getImageUrl(img: string | { url: string } | undefined): string | null {
  if (!img) return null;
  if (typeof img === 'string') return img;
  return img.url || null;
}

/**
 * Pagina de favoritos (wishlist)
 * Muestra los productos guardados por el usuario
 * Los favoritos se persisten en localStorage
 */
export default function FavoritosPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar productos favoritos desde la API
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Obtener productos por sus slugs
        const response = await fetch(`/api/products?slugs=${favorites.join(',')}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchFavoriteProducts();
    }
  }, [favorites, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header de la pagina */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Favoritos</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" />
              <h1 className="section-title">Mis Favoritos</h1>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="text-sm text-accent-muted hover:text-error transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar todo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-custom py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-muted" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="w-20 h-20 mx-auto text-accent-muted mb-6" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Tu lista esta vacia
            </h2>
            <p className="text-accent-muted mb-8 max-w-md mx-auto">
              Agrega productos a tus favoritos para guardarlos y comprarlos mas
              tarde
            </p>
            <Link href="/productos" className="btn-primary">
              Explorar productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <>
            <p className="text-accent-muted mb-6">
              {favorites.length} producto{favorites.length !== 1 && 's'} guardado
              {favorites.length !== 1 && 's'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <Link href={`/producto/${product.slug}`} className="block">
                      <div className="card overflow-hidden">
                        {/* Image */}
                        <div className="relative aspect-[3/4] bg-surface">
                          {getImageUrl(product.images[0]) ? (
                            <Image
                              src={getImageUrl(product.images[0])!}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-accent-muted">
                              Sin imagen
                            </div>
                          )}
                          
                          {/* Discount badge */}
                          {(product.originalPrice || product.compareAtPrice) && 
                           (product.originalPrice || product.compareAtPrice)! > product.price && (
                            <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2 py-1 rounded">
                              -{Math.round((1 - product.price / (product.originalPrice || product.compareAtPrice)!) * 100)}%
                            </span>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="p-4">
                          {product.category && (
                            <p className="text-xs text-accent-muted mb-1">
                              {product.category.name}
                            </p>
                          )}
                          <h3 className="font-medium text-accent group-hover:text-white transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-bold text-accent">
                              ${product.price.toLocaleString()}
                            </span>
                            {(product.originalPrice || product.compareAtPrice) && 
                             (product.originalPrice || product.compareAtPrice)! > product.price && (
                              <span className="text-sm text-accent-muted line-through">
                                ${(product.originalPrice || product.compareAtPrice)!.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeFavorite(product.slug)}
                      className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-error hover:text-white transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-12 text-center">
              <Link href="/productos" className="btn-secondary">
                <ShoppingBag className="w-5 h-5" />
                Seguir comprando
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
