'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Mail, Phone, ArrowRight, Home, CreditCard, Banknote, Building2 } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Contenido de la pagina de confirmacion
 */
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
  const paymentMethod = searchParams.get('method') || searchParams.get('payment_type');
  const status = searchParams.get('status') || searchParams.get('collection_status');
  
  // Generar número de orden si no viene de los params
  const orderNumber = orderId || `KIRA-${Date.now().toString(36).toUpperCase()}`;

  // Determinar si el pago fue exitoso (para MercadoPago)
  const isPaymentApproved = status === 'approved' || !status;

  // Información según método de pago
  const getPaymentInfo = () => {
    if (paymentMethod === 'transfer') {
      return {
        icon: Building2,
        title: 'Transferencia Bancaria',
        description: 'Realiza la transferencia a los siguientes datos y envía el comprobante por WhatsApp:',
        showBankData: true,
      };
    }
    if (paymentMethod === 'cash') {
      return {
        icon: Banknote,
        title: 'Efectivo al retirar',
        description: 'Abonarás al momento de retirar tu pedido en nuestro local.',
        showBankData: false,
      };
    }
    return {
      icon: CreditCard,
      title: 'MercadoPago',
      description: 'Tu pago ha sido procesado exitosamente.',
      showBankData: false,
    };
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card p-8 lg:p-12 max-w-lg w-full text-center"
      >
        {/* Icono de exito */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-success" />
        </motion.div>

        {/* Titulo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl lg:text-3xl font-bold mb-2"
        >
          ¡Gracias por tu compra!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-accent-muted mb-6"
        >
          Tu pedido ha sido recibido y esta siendo procesado
        </motion.p>

        {/* Numero de orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-surface rounded-lg mb-8"
        >
          <p className="text-sm text-accent-muted mb-1">Numero de orden</p>
          <p className="font-mono font-bold text-lg tracking-wider">{orderNumber}</p>
        </motion.div>

        {/* Proximos pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-left space-y-4 mb-8"
        >
          <h2 className="font-display font-semibold text-lg">Proximos pasos:</h2>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Confirmacion por email</p>
              <p className="text-sm text-accent-muted">
                Recibiras un email con los detalles de tu pedido
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Preparacion</p>
              <p className="text-sm text-accent-muted">
                Tu pedido sera preparado en 24-48hs habiles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent text-background flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Envio</p>
              <p className="text-sm text-accent-muted">
                Te notificaremos cuando tu pedido sea despachado
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 border border-border rounded-lg mb-8"
        >
          <p className="text-sm text-accent-muted mb-3">¿Tenés alguna consulta?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="inline-flex items-center justify-center gap-2 text-sm hover:text-accent-muted transition-colors"
            >
              <Mail className="w-4 h-4" />
              {SITE_CONFIG.contact.email}
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm hover:text-accent-muted transition-colors"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/" className="btn-secondary flex-1 justify-center">
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
          <Link href="/productos" className="btn-primary flex-1 justify-center">
            Seguir comprando
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Pagina de confirmacion de pedido
 * Se muestra despues de completar el checkout exitosamente
 */
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-accent-muted">Cargando...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
