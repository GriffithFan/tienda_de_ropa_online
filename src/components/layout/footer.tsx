'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Instagram,
  Music2,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Truck,
  RefreshCcw,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG, FOOTER_LINKS, PAYMENT_CONFIG, SHIPPING_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Footer principal de la aplicacion
 * Incluye categorias, informacion, contacto, newsletter y medios de pago
 */
export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* Seccion de beneficios */}
      <BenefitsBar />

      {/* Contenido principal del footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Columna 1: Logo y descripcion */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block font-display text-2xl font-bold tracking-tighter"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="text-sm text-accent-muted leading-relaxed">
              {SITE_CONFIG.tagline}. Ropa alternativa con disenos exclusivos
              inspirados en la estetica japonesa y el streetwear urbano.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border hover:border-accent hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SITE_CONFIG.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border hover:border-accent hover:text-accent transition-colors"
                aria-label="TikTok"
              >
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Categorias */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Informacion */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Informacion</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto y Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg mb-4">Contacto</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-2 text-sm text-accent-muted hover:text-accent transition-colors"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {SITE_CONFIG.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm text-accent-muted hover:text-accent transition-colors"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    {SITE_CONFIG.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-accent-muted">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city},{' '}
                    {SITE_CONFIG.address.province}
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-display font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-sm text-accent-muted mb-3">
                Suscribite para recibir ofertas exclusivas.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Medios de pago y envio */}
      <PaymentMethods />

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-accent-muted">
            <p>
              Copyright {SITE_CONFIG.name} - {new Date().getFullYear()}. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terminos-y-condiciones" className="hover:text-accent transition-colors">
                Terminos y Condiciones
              </Link>
              <Link href="/politica-de-privacidad" className="hover:text-accent transition-colors">
                Politica de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Barra de beneficios superior del footer
 */
function BenefitsBar() {
  const benefits = [
    {
      icon: CreditCard,
      title: '25% OFF Transferencia',
      description: 'Descuento en todos los medios',
    },
    {
      icon: CreditCard,
      title: 'Cuotas sin interes',
      description: '3 y 6 cuotas con todas las tarjetas',
    },
    {
      icon: Truck,
      title: 'Envios a todo el pais',
      description: `Gratis desde $${SHIPPING_CONFIG.freeShippingThreshold.toLocaleString()}`,
    },
    {
      icon: RefreshCcw,
      title: 'Cambios y devoluciones',
      description: 'Primera devolucion gratis',
    },
  ];

  return (
    <div className="border-b border-border">
      <div className="container-custom py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-background border border-border flex-shrink-0">
                <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-medium text-xs sm:text-sm">{benefit.title}</h4>
                <p className="text-[10px] sm:text-xs text-accent-muted mt-0.5 hidden sm:block">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Formulario de suscripcion al newsletter
 */
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulacion de envio
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus('success');
    setEmail('');

    // Reset despues de 3 segundos
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        disabled={status === 'loading'}
        className="flex-1 px-3 py-2 text-sm bg-background"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'px-3 py-2 rounded-lg transition-colors',
          status === 'success'
            ? 'bg-success text-white'
            : 'bg-accent text-background hover:bg-accent/90'
        )}
      >
        {status === 'loading' ? (
          <span className="w-5 h-5 block border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : status === 'success' ? (
          <Shield className="w-5 h-5" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}

/**
 * Seccion de medios de pago y envio
 */
function PaymentMethods() {
  const paymentIcons = [
    { name: 'Visa', icon: 'visa', color: '1A1F71' },
    { name: 'Mastercard', icon: 'mastercard', color: 'EB001B' },
    { name: 'American Express', icon: 'americanexpress', color: '006FCF' },
    { name: 'MercadoPago', icon: 'mercadopago', color: '00B1EA' },
  ];

  const shippingIcons = [
    { name: 'Andreani', src: '/icons/shipping/andreani.svg' },
    { name: 'Correo Argentino', src: '/icons/shipping/correo-argentino-seeklogo.svg' },
    { name: 'OCA', src: '/icons/shipping/correo-oca-seeklogo.svg' },
  ];

  return (
    <div className="border-t border-border">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Medios de pago */}
          <div>
            <h4 className="text-sm font-medium mb-4">Medios de pago</h4>
            <div className="flex flex-wrap items-center gap-2">
              {paymentIcons.map((item) => (
                <div
                  key={item.name}
                  className="w-14 h-9 flex items-center justify-center bg-white rounded p-1.5"
                  title={item.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://cdn.simpleicons.org/${item.icon}/${item.color}`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Medios de envio */}
          <div>
            <h4 className="text-sm font-medium mb-4">Medios de envio</h4>
            <div className="flex flex-wrap items-center gap-2">
              {shippingIcons.map((item) => (
                <div
                  key={item.name}
                  className="h-9 px-2 flex items-center justify-center bg-white rounded"
                  title={item.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-5 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
