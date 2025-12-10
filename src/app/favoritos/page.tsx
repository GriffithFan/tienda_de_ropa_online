'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products';
import { products } from '@/data/products';

/**
 * Pagina de favoritos (wishlist)
 * Muestra los productos guardados por el usuario
 * 
 * Nota: En produccion, los favoritos deberian persistirse
 * en localStorage o en una base de datos si el usuario esta logueado
 */
export default function FavoritosPage() {
  // Estado de ejemplo - en produccion usar Zustand con persistencia
  const [favorites, setFavorites] = useState<string[]>([
    'remera-dragon-spirit',
    'buzo-neko-mafia',
    'pantalon-cargo-tactical',
  ]);

  // Obtener productos favoritos
  const favoriteProducts = products.filter((p) => favorites.includes(p.slug));

  const removeFavorite = (slug: string) => {
    setFavorites((prev) => prev.filter((f) => f !== slug));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

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
                onClick={clearAllFavorites}
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
        {favorites.length === 0 ? (
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
                {favoriteProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <ProductCard product={product} />
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
