'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { products } from '@/data/products';
import { formatPrice, cn, debounce } from '@/lib/utils';
import type { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de busqueda de productos
 * Incluye busqueda en tiempo real, sugerencias y resultados
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Terminos populares de busqueda
  const popularSearches = [
    'remera oversize',
    'hoodie',
    'cargo pants',
    'dragon',
    'kitsune',
  ];

  // Focus en el input al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Bloquear scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Busqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const searchTimeout = setTimeout(() => {
      const searchResults = products.filter((product) => {
        const searchTerm = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          product.category.name.toLowerCase().includes(searchTerm)
        );
      });

      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSearch = (term: string) => {
    setQuery(term);
  };

  const handleResultClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container-custom py-4">
              {/* Header con input de busqueda */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-muted" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-4 py-4 text-lg bg-surface rounded-xl"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-muted hover:text-accent"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="btn-secondary py-4"
                >
                  Cancelar
                </button>
              </div>

              {/* Contenido */}
              <div className="bg-surface rounded-xl p-6">
                {!query ? (
                  /* Estado inicial - busquedas populares */
                  <div className="space-y-6">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-medium text-accent-muted mb-3">
                        <TrendingUp className="w-4 h-4" />
                        Busquedas populares
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-4 py-2 text-sm bg-background rounded-full hover:bg-surface-hover transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : isSearching ? (
                  /* Estado de carga */
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  /* Resultados */
                  <div>
                    <p className="text-sm text-accent-muted mb-4">
                      {results.length} resultado{results.length !== 1 && 's'} para &ldquo;{query}&rdquo;
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/producto/${product.slug}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-background transition-colors group"
                        >
                          <div className="w-16 h-20 bg-background rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-accent transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-sm text-accent-muted mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-accent-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                    {results.length > 6 && (
                      <Link
                        href={`/productos?search=${encodeURIComponent(query)}`}
                        onClick={handleResultClick}
                        className="flex items-center justify-center gap-2 mt-4 py-3 text-sm text-accent-muted hover:text-accent transition-colors"
                      >
                        Ver todos los resultados ({results.length})
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ) : (
                  /* Sin resultados */
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto text-accent-muted mb-4" />
                    <h3 className="font-display font-bold text-lg mb-2">
                      Sin resultados
                    </h3>
                    <p className="text-accent-muted text-sm">
                      No encontramos productos para &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
