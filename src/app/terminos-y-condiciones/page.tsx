'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * Pagina de Terminos y Condiciones
 * Informacion legal sobre el uso del sitio y las compras
 */
export default function TerminosPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <Link href="/" className="hover:text-accent">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-accent">Términos y Condiciones</span>
          </nav>
          <h1 className="section-title">Términos y Condiciones</h1>
          <p className="text-accent-muted mt-2">
            Última actualización: Diciembre 2024
          </p>
        </div>
      </div>

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-custom py-8 max-w-4xl"
      >
        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Al acceder y utilizar el sitio web de KIRA Store, aceptas estos
              términos y condiciones en su totalidad. Si no estás de acuerdo con
              alguna parte de estos términos, te pedimos que no utilices nuestro
              sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              2. Productos y Precios
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              Los precios publicados en el sitio están expresados en Pesos
              Argentinos (ARS) e incluyen IVA. Nos reservamos el derecho de
              modificar los precios sin previo aviso.
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Las imágenes de los productos son ilustrativas</li>
              <li>Los colores pueden variar levemente según el monitor</li>
              <li>La disponibilidad está sujeta a stock</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              3. Proceso de Compra
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              Al realizar una compra en KIRA Store:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Debes ser mayor de 18 años o contar con autorización</li>
              <li>La información proporcionada debe ser veraz y completa</li>
              <li>
                El pedido se confirma una vez verificado el pago
              </li>
              <li>
                Recibirás un email de confirmación con los detalles de tu compra
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              4. Medios de Pago
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Aceptamos los siguientes medios de pago:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2 mt-4">
              <li>Tarjetas de crédito y débito (via MercadoPago)</li>
              <li>Transferencia bancaria (10% de descuento)</li>
              <li>Efectivo al retirar en local (10% de descuento)</li>
              <li>Rapipago / Pago Fácil</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              5. Envíos
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              Realizamos envíos a todo el país mediante:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Andreani</li>
              <li>Correo Argentino</li>
              <li>Retiro en local (Morón, Buenos Aires)</li>
            </ul>
            <p className="text-accent-muted leading-relaxed mt-4">
              Los tiempos de entrega son estimativos y pueden variar según la
              zona. Envío gratis en compras superiores a $50.000.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              6. Cambios y Devoluciones
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              Aceptamos cambios dentro de los 30 días posteriores a la compra,
              siempre que:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>El producto esté sin uso y con etiquetas originales</li>
              <li>Conserves el ticket o comprobante de compra</li>
              <li>El producto no sea de liquidación o promoción especial</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              7. Propiedad Intelectual
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Todo el contenido del sitio (imágenes, textos, logos, diseños) es
              propiedad de KIRA Store y está protegido por las leyes de
              propiedad intelectual. Queda prohibida su reproducción sin
              autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              8. Contacto
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Para cualquier consulta sobre estos términos, podés contactarnos a
              través de nuestra{' '}
              <Link href="/contacto" className="text-accent hover:underline">
                página de contacto
              </Link>{' '}
              o enviarnos un email a hola@kirastore.com.ar
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
