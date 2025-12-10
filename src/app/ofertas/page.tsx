'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, Percent, Clock, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products';
import { products } from '@/data/products';

/**
 * Pagina de Ofertas
 * Muestra productos en liquidacion y con descuentos
 */
export default function OfertasPage() {
  // Filtrar productos en oferta
  const saleProducts = useMemo(() => {
    return products.filter((p) => p.isOnSale || p.compareAtPrice);
  }, []);

  // Calcular el mayor descuento disponible
  const maxDiscount = useMemo(() => {
    let max = 0;
    saleProducts.forEach((p) => {
      if (p.compareAtPrice) {
        const discount = Math.round(
          ((p.compareAtPrice - p.price) / p.compareAtPrice) * 100
        );
        if (discount > max) max = discount;
      }
    });
    return max;
  }, [saleProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border">
        <div className="container-custom py-12 lg:py-16">
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Ofertas</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Percent className="w-6 h-6 text-primary" />
                </div>
                <h1 className="section-title text-3xl lg:text-4xl">Ofertas</h1>
              </div>
              <p className="text-accent-muted max-w-xl">
                Aprovecha los mejores descuentos en nuestra colección. Productos
                seleccionados con precios increíbles por tiempo limitado.
              </p>
            </div>

            {/* Banner de descuento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 p-6 bg-primary/10 border border-primary/30 rounded-xl text-center"
            >
              <p className="text-sm text-accent-muted mb-1">Hasta</p>
              <p className="font-display text-5xl font-bold text-primary">
                {maxDiscount}%
              </p>
              <p className="text-sm text-accent-muted">de descuento</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Banners promocionales */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <Tag className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-sm">25% OFF</p>
              <p className="text-xs text-accent-muted">Pagando por transferencia</p>
            </div>
          </div>
          <div className="p-4 bg-surface rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Percent className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-sm">3 y 6 cuotas sin interés</p>
              <p className="text-xs text-accent-muted">Con todas las tarjetas</p>
            </div>
          </div>
          <div className="p-4 bg-surface rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-medium text-sm">Ofertas limitadas</p>
              <p className="text-xs text-accent-muted">Hasta agotar stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos en oferta */}
      <div className="container-custom py-8">
        {saleProducts.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 mx-auto text-accent-muted mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              No hay ofertas activas
            </h2>
            <p className="text-accent-muted mb-6">
              ¡Volvé pronto! Estamos preparando nuevas promociones.
            </p>
            <Link href="/productos" className="btn-primary">
              Ver todos los productos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-accent-muted">
                {saleProducts.length} producto
                {saleProducts.length !== 1 && 's'} en oferta
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="container-custom py-8 pb-16">
        <div className="bg-surface rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">
            ¿Querés más descuentos?
          </h2>
          <p className="text-accent-muted mb-6 max-w-lg mx-auto">
            Suscribite a nuestro newsletter y recibí ofertas exclusivas, acceso
            anticipado a nuevas colecciones y un 10% de descuento en tu primera
            compra.
          </p>
          <Link href="/#newsletter" className="btn-primary">
            Suscribirme
          </Link>
        </div>
      </div>
    </div>
  );
}
