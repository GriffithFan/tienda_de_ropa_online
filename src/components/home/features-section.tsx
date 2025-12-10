'use client';

import { motion } from 'framer-motion';
import {
  Truck,
  CreditCard,
  RefreshCcw,
  Shield,
  Clock,
  Headphones,
} from 'lucide-react';

/**
 * Seccion de beneficios y caracteristicas de la tienda
 */
export function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: '25% OFF Transferencia',
      description: 'Descuento especial pagando por transferencia bancaria',
    },
    {
      icon: CreditCard,
      title: 'Cuotas sin interes',
      description: '3 y 6 cuotas sin interes con todas las tarjetas',
    },
    {
      icon: Truck,
      title: 'Envios a todo el pais',
      description: 'Gratis superando los $150.000 en tu compra',
    },
    {
      icon: RefreshCcw,
      title: 'Cambios y devoluciones',
      description: 'Primera devolucion gratuita sin preguntas',
    },
    {
      icon: Shield,
      title: 'Compra segura',
      description: 'Pago 100% seguro con MercadoPago',
    },
    {
      icon: Headphones,
      title: 'Atencion personalizada',
      description: 'Respondemos tus consultas de lunes a viernes',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-surface">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Por que elegirnos</h2>
          <p className="section-subtitle mt-2 mx-auto">
            Beneficios exclusivos para nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-background border border-border group-hover:border-accent transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-accent-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
