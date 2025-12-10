'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice, calculateTransferPrice, cn } from '@/lib/utils';
import { SHIPPING_CONFIG, PAYMENT_CONFIG } from '@/lib/constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Drawer lateral del carrito de compras
 * Muestra los productos agregados con opciones para modificar cantidades
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getSubtotal();
  const transferPrice = calculateTransferPrice(subtotal, PAYMENT_CONFIG.transferDiscount);
  const remainingForFreeShipping = SHIPPING_CONFIG.freeShippingThreshold - subtotal;
  const hasFreeShipping = subtotal >= SHIPPING_CONFIG.freeShippingThreshold;

  // Bloquear scroll cuando el drawer esta abierto
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

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-display font-bold text-lg">Carrito de Compras</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-surface rounded-full">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="btn-icon"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del carrito */}
            {items.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.size}-${item.color}`}
                      item={item}
                      onUpdateQuantity={(qty) =>
                        updateQuantity(item.productId, item.size, item.color, qty)
                      }
                      onRemove={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                    />
                  ))}
                </div>

                {/* Barra de progreso para envio gratis */}
                {!hasFreeShipping && (
                  <div className="px-4 pb-4">
                    <div className="bg-surface rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-accent-muted">
                          Te faltan{' '}
                          <span className="text-accent font-medium">
                            {formatPrice(remainingForFreeShipping)}
                          </span>{' '}
                          para envio gratis
                        </span>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (subtotal / SHIPPING_CONFIG.freeShippingThreshold) * 100,
                              100
                            )}%`,
                          }}
                          className="h-full bg-success rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumen y checkout */}
                <div className="border-t border-border p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-accent-muted">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-success">
                      <span className="text-sm">
                        Con transferencia ({PAYMENT_CONFIG.transferDiscount}% OFF)
                      </span>
                      <span className="font-medium">{formatPrice(transferPrice)}</span>
                    </div>
                  </div>

                  {/* Calculador de envio */}
                  <ShippingCalculator />

                  {/* Botones de accion */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="btn-primary w-full justify-center"
                    >
                      Iniciar Compra
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/productos"
                      onClick={onClose}
                      className="btn-ghost w-full justify-center text-sm"
                    >
                      Ver mas productos
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Item individual del carrito
 */
interface CartItemProps {
  item: {
    productId: string;
    product: {
      id: string;
      name: string;
      price: number;
      images: { url: string; alt: string }[];
    };
    quantity: number;
    size: string;
    color: string;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, size, color } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="flex gap-4 p-3 bg-surface rounded-xl"
    >
      {/* Imagen del producto */}
      <div className="w-20 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0 relative">
        <div className="absolute inset-0 flex items-center justify-center text-accent-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
      </div>

      {/* Informacion del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-accent-muted mb-2">
          {color} / {size}
        </p>

        <div className="flex items-center justify-between">
          {/* Control de cantidad */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded bg-background hover:bg-surface-hover transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded bg-background hover:bg-surface-hover transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Precio */}
          <span className="font-medium text-sm">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>

      {/* Boton eliminar */}
      <button
        onClick={onRemove}
        className="self-start p-1.5 text-accent-muted hover:text-error transition-colors"
        aria-label="Eliminar producto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/**
 * Estado vacio del carrito
 */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-surface mb-4">
        <ShoppingBag className="w-10 h-10 text-accent-muted" />
      </div>
      <h3 className="font-display font-bold text-lg mb-2">
        Tu carrito esta vacio
      </h3>
      <p className="text-accent-muted text-sm mb-6">
        Agrega productos para comenzar tu compra
      </p>
      <Link href="/productos" onClick={onClose} className="btn-primary">
        Ver productos
      </Link>
    </div>
  );
}

/**
 * Calculador de costo de envio
 */
function ShippingCalculator() {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Tu codigo postal"
        className="flex-1 px-3 py-2 text-sm"
        maxLength={8}
      />
      <button className="btn-secondary btn-sm">Calcular</button>
    </div>
  );
}
