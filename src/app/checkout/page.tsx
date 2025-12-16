'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  User,
  Check,
  ShoppingBag,
  Building2,
  Banknote,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice, calculateTransferPrice, cn } from '@/lib/utils';
import { PAYMENT_CONFIG, SHIPPING_CONFIG } from '@/lib/constants';

/**
 * Schema de validacion para datos personales
 */
const personalDataSchema = z.object({
  firstName: z.string().min(2, 'Ingresa tu nombre'),
  lastName: z.string().min(2, 'Ingresa tu apellido'),
  email: z.string().email('Ingresa un email valido'),
  phone: z.string().min(8, 'Ingresa un telefono valido'),
  dni: z.string().min(7, 'Ingresa un DNI valido'),
});

/**
 * Schema de validacion para direccion de envio
 */
const shippingSchema = z.object({
  street: z.string().min(3, 'Ingresa la calle'),
  number: z.string().min(1, 'Ingresa la altura'),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(2, 'Ingresa la ciudad'),
  province: z.string().min(2, 'Selecciona la provincia'),
  postalCode: z.string().min(4, 'Ingresa el codigo postal'),
});

type PersonalData = z.infer<typeof personalDataSchema>;
type ShippingData = z.infer<typeof shippingSchema>;

type CheckoutStep = 'cart' | 'shipping' | 'payment';

/**
 * Pagina de checkout
 * Proceso de compra en multiples pasos
 */
export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getSubtotal();
  const shippingCost = subtotal >= SHIPPING_CONFIG.freeShippingThreshold ? 0 : 5000;
  const discount = selectedPayment === 'transfer' 
    ? Math.round(subtotal * (PAYMENT_CONFIG.transferDiscount / 100))
    : 0;
  const total = subtotal + shippingCost - discount;

  const steps = [
    { id: 'cart', label: 'Carrito', icon: ShoppingBag },
    { id: 'shipping', label: 'Envio', icon: Truck },
    { id: 'payment', label: 'Pago', icon: CreditCard },
  ];

  const handlePersonalDataSubmit = (data: PersonalData) => {
    setPersonalData(data);
    setCurrentStep('shipping');
  };

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment || !personalData || !shippingData) return;

    setIsProcessing(true);

    try {
      // Si es MercadoPago, crear preferencia y redirigir
      if (selectedPayment === 'mercadopago') {
        const orderId = `KURO-${Date.now().toString(36).toUpperCase()}`;

        // Preparar items para MercadoPago
        const mpItems = items.map((item) => ({
          id: item.productId,
          title: `${item.product.name} - ${item.size}`,
          quantity: item.quantity,
          unit_price: Math.round(Number(item.product.price)),
          picture_url: item.product.images?.[0] || '',
        }));

        // Preparar datos del comprador
        const phoneParts = personalData.phone.replace(/\D/g, '');
        const payer = {
          name: personalData.firstName,
          surname: personalData.lastName,
          email: personalData.email,
          phone: {
            area_code: phoneParts.slice(0, 2),
            number: phoneParts.slice(2),
          },
          identification: {
            type: 'DNI',
            number: personalData.dni,
          },
          address: {
            street_name: shippingData.street,
            street_number: shippingData.number,
            zip_code: shippingData.postalCode,
          },
        };

        // Llamar a la API de MercadoPago
        const response = await fetch('/api/checkout/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: mpItems, payer, orderId }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Mensaje más descriptivo según el error
          if (data.error?.includes('access token') || data.error?.includes('unauthorized')) {
            throw new Error('Error de configuración de MercadoPago. Por favor, contacta al administrador.');
          }
          throw new Error(data.error || 'Error al crear el pago');
        }

        // Redirigir al checkout de MercadoPago
        // En desarrollo usar sandbox_init_point, en producción usar init_point
        const checkoutUrl = process.env.NODE_ENV === 'production' 
          ? data.init_point 
          : data.sandbox_init_point || data.init_point;

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error('No se pudo obtener la URL de pago');
        }
        return;
      }

      // Para otros métodos de pago (transferencia, efectivo)
      const orderId = `KURO-${Date.now().toString(36).toUpperCase()}`;
      
      // Aquí podrías guardar la orden en la base de datos
      // await fetch('/api/orders', { ... });

      clearCart();
      router.push(`/checkout/confirmacion?orderId=${orderId}&method=${selectedPayment}`);
    } catch (error) {
      console.error('Error en el pago:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-accent-muted mb-4" />
          <h1 className="section-title mb-4">Tu carrito esta vacio</h1>
          <p className="text-accent-muted mb-6">
            Agrega productos para continuar con la compra
          </p>
          <Link href="/productos" className="btn-primary">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container-custom py-6">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-accent-muted hover:text-accent mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
          <h1 className="section-title">Checkout</h1>
        </div>
      </div>

      {/* Progress steps */}
      <div className="bg-background border-b border-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted =
                (step.id === 'cart' && currentStep !== 'cart') ||
                (step.id === 'shipping' && currentStep === 'payment');

              return (
                <div key={step.id} className="flex items-center gap-4">
                  {index > 0 && (
                    <div
                      className={cn(
                        'w-12 h-0.5',
                        isCompleted || isActive ? 'bg-accent' : 'bg-border'
                      )}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                        isActive && 'bg-accent text-background',
                        isCompleted && 'bg-success text-white',
                        !isActive && !isCompleted && 'bg-surface text-accent-muted'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium hidden sm:block',
                        isActive ? 'text-accent' : 'text-accent-muted'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'cart' && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <CartStep onSubmit={handlePersonalDataSubmit} />
                </motion.div>
              )}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ShippingStep
                    onSubmit={handleShippingSubmit}
                    onBack={() => setCurrentStep('cart')}
                    selectedShipping={selectedShipping}
                    onShippingChange={setSelectedShipping}
                  />
                </motion.div>
              )}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PaymentStep
                    selectedPayment={selectedPayment}
                    onPaymentChange={setSelectedPayment}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setCurrentStep('shipping')}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-32">
              <h2 className="font-display font-bold text-lg mb-6">
                Resumen del pedido
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    <div className="w-16 h-20 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-accent-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-accent-muted mt-1">
                        {item.color} / {item.size} x {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider mb-6" />

              {/* Totales */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-muted">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-muted">Envio</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success">Gratis</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Descuento transferencia</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="divider my-4" />

              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {selectedPayment === 'transfer' && (
                <p className="text-xs text-success mt-2">
                  Ahorraste {formatPrice(discount)} pagando por transferencia
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Paso 1: Carrito y datos personales
 */
function CartStep({ onSubmit }: { onSubmit: (data: PersonalData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalData>({
    resolver: zodResolver(personalDataSchema),
  });

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6" />
        <h2 className="font-display font-bold text-xl">Datos personales</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label">Nombre *</label>
            <input
              type="text"
              placeholder="Tu nombre"
              {...register('firstName')}
              className={cn(errors.firstName && 'border-error')}
            />
            {errors.firstName && (
              <span className="input-error">{errors.firstName.message}</span>
            )}
          </div>
          <div className="input-group">
            <label className="input-label">Apellido *</label>
            <input
              type="text"
              placeholder="Tu apellido"
              {...register('lastName')}
              className={cn(errors.lastName && 'border-error')}
            />
            {errors.lastName && (
              <span className="input-error">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Email *</label>
          <input
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            className={cn(errors.email && 'border-error')}
          />
          {errors.email && (
            <span className="input-error">{errors.email.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label">Telefono *</label>
            <input
              type="tel"
              placeholder="11 1234-5678"
              {...register('phone')}
              className={cn(errors.phone && 'border-error')}
            />
            {errors.phone && (
              <span className="input-error">{errors.phone.message}</span>
            )}
          </div>
          <div className="input-group">
            <label className="input-label">DNI *</label>
            <input
              type="text"
              placeholder="12345678"
              {...register('dni')}
              className={cn(errors.dni && 'border-error')}
            />
            {errors.dni && (
              <span className="input-error">{errors.dni.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center">
          Continuar
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

/**
 * Paso 2: Envio
 */
function ShippingStep({
  onSubmit,
  onBack,
  selectedShipping,
  onShippingChange,
}: {
  onSubmit: (data: ShippingData) => void;
  onBack: () => void;
  selectedShipping: string;
  onShippingChange: (value: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });

  const shippingOptions = [
    {
      id: 'andreani',
      name: 'Andreani a domicilio',
      price: 5000,
      time: '2-4 dias habiles',
    },
    {
      id: 'correo-argentino',
      name: 'Correo Argentino a domicilio',
      price: 4500,
      time: '3-5 dias habiles',
    },
    {
      id: 'retiro',
      name: 'Retiro en local (Moron)',
      price: 0,
      time: 'Coordinar por WhatsApp',
    },
  ];

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-6 h-6" />
        <h2 className="font-display font-bold text-xl">Datos de envio</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Metodo de envio */}
        <div>
          <label className="input-label mb-3 block">Metodo de envio</label>
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                  selectedShipping === option.id
                    ? 'border-accent bg-surface'
                    : 'border-border hover:border-accent-muted'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedShipping === option.id}
                    onChange={(e) => onShippingChange(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      selectedShipping === option.id
                        ? 'border-accent'
                        : 'border-border'
                    )}
                  >
                    {selectedShipping === option.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-accent-muted">{option.time}</p>
                  </div>
                </div>
                <span className="font-medium">
                  {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {selectedShipping !== 'retiro' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 input-group">
                <label className="input-label">Calle *</label>
                <input
                  type="text"
                  placeholder="Av. Corrientes"
                  {...register('street')}
                  className={cn(errors.street && 'border-error')}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Altura *</label>
                <input
                  type="text"
                  placeholder="1234"
                  {...register('number')}
                  className={cn(errors.number && 'border-error')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Piso</label>
                <input type="text" placeholder="4" {...register('floor')} />
              </div>
              <div className="input-group">
                <label className="input-label">Depto</label>
                <input type="text" placeholder="A" {...register('apartment')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="input-group">
                <label className="input-label">Ciudad *</label>
                <input
                  type="text"
                  placeholder="Buenos Aires"
                  {...register('city')}
                  className={cn(errors.city && 'border-error')}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Provincia *</label>
                <select
                  {...register('province')}
                  className={cn(errors.province && 'border-error')}
                >
                  <option value="">Seleccionar</option>
                  <option value="CABA">CABA</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Cordoba">Cordoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Mendoza">Mendoza</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Codigo Postal *</label>
                <input
                  type="text"
                  placeholder="1043"
                  {...register('postalCode')}
                  className={cn(errors.postalCode && 'border-error')}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={onBack} className="btn-secondary flex-1">
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
          <button
            type="submit"
            disabled={!selectedShipping}
            className="btn-primary flex-1 justify-center"
          >
            Continuar
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Paso 3: Pago
 */
function PaymentStep({
  selectedPayment,
  onPaymentChange,
  onSubmit,
  onBack,
  isProcessing,
}: {
  selectedPayment: string;
  onPaymentChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isProcessing: boolean;
}) {
  const paymentOptions = [
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      description: 'Tarjetas de credito y debito, Pago Facil, Rapipago',
      icon: CreditCard,
      discount: 0,
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: `${PAYMENT_CONFIG.transferDiscount}% de descuento`,
      icon: Building2,
      discount: PAYMENT_CONFIG.transferDiscount,
    },
    {
      id: 'cash',
      name: 'Efectivo al retirar',
      description: `${PAYMENT_CONFIG.cashDiscount}% de descuento`,
      icon: Banknote,
      discount: PAYMENT_CONFIG.cashDiscount,
    },
  ];

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6" />
        <h2 className="font-display font-bold text-xl">Metodo de pago</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          {paymentOptions.map((option) => (
            <label
              key={option.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors',
                selectedPayment === option.id
                  ? 'border-accent bg-surface'
                  : 'border-border hover:border-accent-muted'
              )}
            >
              <input
                type="radio"
                name="payment"
                value={option.id}
                checked={selectedPayment === option.id}
                onChange={(e) => onPaymentChange(e.target.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                  selectedPayment === option.id
                    ? 'border-accent'
                    : 'border-border'
                )}
              >
                {selectedPayment === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <option.icon className="w-5 h-5" />
                  <span className="font-medium">{option.name}</span>
                  {option.discount > 0 && (
                    <span className="badge-success">{option.discount}% OFF</span>
                  )}
                </div>
                <p className="text-sm text-accent-muted mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Datos bancarios para transferencia */}
        {selectedPayment === 'transfer' && (
          <div className="p-4 bg-surface rounded-lg">
            <h3 className="font-medium mb-3">Datos para transferencia</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-accent-muted">Banco:</span>{' '}
                {PAYMENT_CONFIG.transferInfo.bank}
              </p>
              <p>
                <span className="text-accent-muted">CBU:</span>{' '}
                <span className="font-mono">{PAYMENT_CONFIG.transferInfo.cbu}</span>
              </p>
              <p>
                <span className="text-accent-muted">Alias:</span>{' '}
                {PAYMENT_CONFIG.transferInfo.alias}
              </p>
              <p>
                <span className="text-accent-muted">Titular:</span>{' '}
                {PAYMENT_CONFIG.transferInfo.holder}
              </p>
              <p>
                <span className="text-accent-muted">CUIT:</span>{' '}
                {PAYMENT_CONFIG.transferInfo.cuit}
              </p>
            </div>
            <p className="text-xs text-accent-muted mt-4">
              Luego de realizar la transferencia, envianos el comprobante por
              WhatsApp para confirmar tu pedido.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={onBack} className="btn-secondary flex-1">
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedPayment || isProcessing}
            className="btn-primary flex-1 justify-center"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Confirmar pedido
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
