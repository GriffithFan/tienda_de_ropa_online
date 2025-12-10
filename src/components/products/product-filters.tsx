'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COLORS, SIZES, SORT_OPTIONS } from '@/lib/constants';
import type { FilterState } from '@/types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSortChange?: (sort: string) => void;
  currentSort?: string;
  totalProducts: number;
  categoryType?: 'remeras' | 'hoodies' | 'pants' | 'shorts';
}

/**
 * Panel de filtros para productos
 * Incluye categorias, talles, colores, precio y ordenamiento
 */
export function ProductFilters({
  filters,
  onFilterChange,
  onSortChange,
  currentSort,
  totalProducts,
  categoryType = 'remeras',
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    'sizes',
    'colors',
    'price',
  ]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const availableSizes = SIZES[categoryType] || SIZES.remeras;

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 200000],
      onSale: false,
      inStock: true,
    });
  };

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.onSale ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 200000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header con contador y limpiar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-accent-muted">
          {totalProducts} producto{totalProducts !== 1 && 's'}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-accent-muted hover:text-accent transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtro de talles */}
      <FilterSection
        title="Talle"
        isOpen={openSections.includes('sizes')}
        onToggle={() => toggleSection('sizes')}
      >
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                filters.sizes.includes(size)
                  ? 'bg-accent text-background border-accent'
                  : 'border-border hover:border-accent-muted'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Filtro de colores */}
      <FilterSection
        title="Color"
        isOpen={openSections.includes('colors')}
        onToggle={() => toggleSection('colors')}
      >
        <div className="grid grid-cols-2 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorToggle(color.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors text-left',
                filters.colors.includes(color.id)
                  ? 'border-accent bg-surface'
                  : 'border-border hover:border-accent-muted'
              )}
            >
              <span
                className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Filtro de precio */}
      <FilterSection
        title="Precio"
        isOpen={openSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0] || ''}
              onChange={(e) =>
                handlePriceChange(
                  Number(e.target.value) || 0,
                  filters.priceRange[1]
                )
              }
              className="flex-1 px-3 py-2 text-sm"
            />
            <span className="text-accent-muted">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1] || ''}
              onChange={(e) =>
                handlePriceChange(
                  filters.priceRange[0],
                  Number(e.target.value) || 200000
                )
              }
              className="flex-1 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Solo en oferta */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">Solo ofertas</span>
        <button
          onClick={() => onFilterChange({ ...filters, onSale: !filters.onSale })}
          className={cn(
            'w-10 h-6 rounded-full transition-colors relative',
            filters.onSale ? 'bg-accent' : 'bg-surface-hover'
          )}
        >
          <span
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              filters.onSale ? 'translate-x-5' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header de ordenamiento - siempre visible */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Boton de filtros mobile */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="lg:hidden btn-secondary btn-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="w-5 h-5 flex items-center justify-center bg-accent text-background text-xs rounded-full">
              {filters.sizes.length + filters.colors.length}
            </span>
          )}
        </button>

        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-accent-muted hidden sm:block">
            Ordenar por:
          </span>
          <select
            value={currentSort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="text-sm py-2 pl-3 pr-8 min-w-[160px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Panel de filtros desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32">
          <h2 className="font-display font-bold text-lg mb-6">Filtrar por</h2>
          <FilterContent />
        </div>
      </aside>

      {/* Modal de filtros mobile */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-background border-r border-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-display font-bold text-lg">Filtros</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="btn-icon"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
              <div className="sticky bottom-0 p-4 border-t border-border bg-background">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="btn-primary w-full"
                >
                  Ver {totalProducts} productos
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Seccion colapsable de filtro
 */
interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-t border-border pt-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="font-medium text-sm">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
