'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store';
import { NAV_LINKS, CATEGORIES, SITE_CONFIG } from '@/lib/constants';
import { AnnouncementBar } from './announcement-bar';
import { CartDrawer } from '../cart/cart-drawer';
import { SearchModal } from '../search/search-modal';

/**
 * Header principal de la aplicacion
 * Incluye logo, navegacion, busqueda, cuenta y carrito
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);

  // Detectar scroll para cambiar estilos del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menu mobile al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevenir scroll cuando el menu mobile esta abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg'
            : 'bg-background'
        )}
      >
        {/* Cinta de anuncios */}
        <AnnouncementBar />

        {/* Header superior con logo, busqueda y acciones */}
        <div className="border-b border-border">
          <div className="container-custom h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 font-display text-2xl sm:text-3xl font-bold tracking-tighter"
            >
              {SITE_CONFIG.name}
            </Link>

            {/* Barra de busqueda - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-lg text-accent-muted hover:border-border-hover transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Buscar productos...</span>
              </button>
            </div>

            {/* Acciones - Desktop */}
            <div className="flex items-center gap-1">
              {/* Busqueda mobile */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden btn-icon"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favoritos */}
              <Link href="/favoritos" className="hidden sm:flex btn-icon">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cuenta */}
              <Link href="/perfil" className="btn-icon">
                <User className="w-5 h-5" />
              </Link>

              {/* Carrito */}
              <button
                onClick={openCart}
                className="btn-icon relative"
                aria-label={`Carrito (${cartItemCount} productos)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-background text-xs font-bold rounded-full">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Menu hamburguesa - Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden btn-icon ml-2"
                aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navegacion principal - Desktop */}
        <nav className="hidden lg:block border-b border-border">
          <div className="container-custom">
            <ul className="flex items-center justify-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsCategoriesOpen(true)}
                      onMouseLeave={() => setIsCategoriesOpen(false)}
                    >
                      <button
                        className={cn(
                          'flex items-center gap-1 px-4 py-4 text-sm font-medium transition-colors',
                          pathname.startsWith('/categoria')
                            ? 'text-accent'
                            : 'text-accent-muted hover:text-accent'
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            isCategoriesOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Dropdown de categorias */}
                      <AnimatePresence>
                        {isCategoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 w-56 py-2 bg-surface border border-border rounded-lg shadow-xl"
                          >
                            {CATEGORIES.map((category) => (
                              <Link
                                key={category.id}
                                href={`/categoria/${category.slug}`}
                                className="block px-4 py-2.5 text-sm text-accent-muted hover:text-accent hover:bg-surface-hover transition-colors"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'block px-4 py-4 text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'text-accent'
                          : 'text-accent-muted hover:text-accent'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel del menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-background border-r border-border z-50 lg:hidden overflow-y-auto"
            >
              {/* Header del menu mobile */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display text-xl font-bold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-icon"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links de navegacion */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      {link.hasDropdown ? (
                        <MobileDropdown label={link.label} />
                      ) : (
                        <Link
                          href={link.href}
                          className={cn(
                            'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                            pathname === link.href
                              ? 'bg-surface text-accent'
                              : 'text-accent-muted hover:bg-surface hover:text-accent'
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Links de cuenta */}
              <div className="p-4 border-t border-border">
                <Link
                  href="/cuenta"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent-muted hover:bg-surface hover:text-accent transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Mi Cuenta</span>
                </Link>
                <Link
                  href="/favoritos"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-accent-muted hover:bg-surface hover:text-accent transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de busqueda */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Drawer del carrito */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* Espaciador para compensar el header fixed */}
      <div className="h-[calc(var(--announcement-height)+4rem+3.5rem)] lg:h-[calc(var(--announcement-height)+4rem+3.5rem)]" />
    </>
  );
}

/**
 * Dropdown de categorias para mobile
 */
function MobileDropdown({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors',
          pathname.startsWith('/categoria')
            ? 'bg-surface text-accent'
            : 'text-accent-muted hover:bg-surface hover:text-accent'
        )}
      >
        {label}
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
            <div className="pl-4 py-2 space-y-1">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="block px-4 py-2 rounded-lg text-sm text-accent-muted hover:bg-surface hover:text-accent transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
