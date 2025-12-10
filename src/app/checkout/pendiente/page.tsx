'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Mail, Phone, ArrowRight, Home, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG, PAYMENT_CONFIG } from '@/lib/constants';

/**
 * Pagina de pago pendiente
 * Se muestra cuando el cliente elige pagar por transferencia
 * o cuando MercadoPago devuelve un estado pendiente
 */
export default function PendingPaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || `KIRA-${Date.now().toString(36).toUpperCase()}`;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error copiando al clipboard:', err);
    }
  };

  const bankInfo = PAYMENT_CONFIG.transferInfo;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card p-8 lg:p-12 max-w-lg w-full"
      >
        {/* Icono de pendiente */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6"
        >
          <Clock className="w-10 h-10 text-warning" />
        </motion.div>

        {/* Titulo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold mb-2">
            Pago Pendiente
          </h1>
          <p className="text-accent-muted">
            Tu orden esta reservada. Realiza la transferencia para confirmarla.
          </p>
        </motion.div>

        {/* Numero de orden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-surface rounded-lg mb-6 text-center"
        >
          <p className="text-sm text-accent-muted mb-1">Numero de orden</p>
          <p className="font-mono font-bold text-lg tracking-wider">{orderId}</p>
        </motion.div>

        {/* Datos bancarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-border rounded-lg p-6 mb-6"
        >
          <h2 className="font-display font-semibold text-lg mb-4">
            Datos para la transferencia
          </h2>
          
          <div className="space-y-4">
            {/* Banco */}
            <div className="flex justify-between items-center">
              <span className="text-accent-muted">Banco</span>
              <span className="font-medium">{bankInfo.bank}</span>
            </div>

            {/* CBU */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-accent-muted">CBU</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{bankInfo.cbu}</span>
                <button
                  onClick={() => copyToClipboard(bankInfo.cbu, 'cbu')}
                  className="p-1 hover:bg-surface rounded transition-colors"
                  title="Copiar CBU"
                >
                  {copiedField === 'cbu' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-accent-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Alias */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-accent-muted">Alias</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{bankInfo.alias}</span>
                <button
                  onClick={() => copyToClipboard(bankInfo.alias, 'alias')}
                  className="p-1 hover:bg-surface rounded transition-colors"
                  title="Copiar Alias"
                >
                  {copiedField === 'alias' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-accent-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Titular */}
            <div className="flex justify-between items-center">
              <span className="text-accent-muted">Titular</span>
              <span className="font-medium">{bankInfo.holder}</span>
            </div>

            {/* CUIT */}
            <div className="flex justify-between items-center">
              <span className="text-accent-muted">CUIT</span>
              <span className="font-medium">{bankInfo.cuit}</span>
            </div>
          </div>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8"
        >
          <h3 className="font-medium text-warning mb-2">Importante</h3>
          <ul className="text-sm text-accent-muted space-y-1">
            <li>• La orden expira en 48 horas si no recibimos el pago</li>
            <li>• Incluye el numero de orden en la descripcion de la transferencia</li>
            <li>• Una vez realizada, envía el comprobante para confirmar tu pedido</li>
          </ul>
        </motion.div>

        {/* Contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-accent-muted mb-3">
            Envía el comprobante a:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${SITE_CONFIG.contact.email}?subject=Comprobante orden ${orderId}`}
              className="inline-flex items-center justify-center gap-2 btn-secondary"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=Hola! Te envío el comprobante de la orden ${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-primary"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Navegacion */}
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
