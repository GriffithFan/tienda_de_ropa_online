'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';

/**
 * Pagina de Politica de Privacidad
 * Informacion sobre el tratamiento de datos personales
 */
export default function PrivacidadPage() {
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
            <span className="text-accent">Política de Privacidad</span>
          </nav>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <h1 className="section-title">Política de Privacidad</h1>
          </div>
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
              1. Información que Recopilamos
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              En KURO recopilamos información que nos proporcionas
              directamente cuando:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Realizas una compra (nombre, email, teléfono, dirección)</li>
              <li>Creas una cuenta en nuestro sitio</li>
              <li>Te suscribes a nuestro newsletter</li>
              <li>Nos contactas por cualquier medio</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              2. Uso de la Información
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Procesar y enviar tus pedidos</li>
              <li>Comunicarnos contigo sobre tu compra</li>
              <li>Enviarte novedades y promociones (si diste tu consentimiento)</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              3. Protección de Datos
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información personal. Los pagos son procesados de
              forma segura a través de MercadoPago, sin que tengamos acceso a
              los datos de tu tarjeta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              4. Compartir Información
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              No vendemos ni alquilamos tu información personal. Solo la
              compartimos con:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Servicios de envío (para entregar tu pedido)</li>
              <li>Procesadores de pago (MercadoPago)</li>
              <li>Autoridades cuando sea requerido por ley</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              5. Cookies
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Utilizamos cookies para mejorar tu experiencia de navegación,
              recordar tus preferencias y analizar el tráfico del sitio. Podés
              configurar tu navegador para rechazar las cookies, aunque esto
              podría afectar algunas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              6. Tus Derechos
            </h2>
            <p className="text-accent-muted leading-relaxed mb-4">
              De acuerdo con la Ley de Protección de Datos Personales (Ley
              25.326), tenés derecho a:
            </p>
            <ul className="list-disc list-inside text-accent-muted space-y-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al tratamiento de tus datos</li>
              <li>Revocar el consentimiento otorgado</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              7. Retención de Datos
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Conservamos tu información personal mientras sea necesaria para
              los fines descritos, o según lo requiera la ley. Los datos de
              facturación se conservan por el plazo legal de 10 años.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              8. Cambios en esta Política
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Nos reservamos el derecho de modificar esta política de
              privacidad. Los cambios serán publicados en esta página con la
              fecha de actualización.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-4">
              9. Contacto
            </h2>
            <p className="text-accent-muted leading-relaxed">
              Para ejercer tus derechos o consultas sobre privacidad, contactanos
              en:{' '}
              <a
                href="mailto:privacidad@kuro.com.ar"
                className="text-accent hover:underline"
              >
                privacidad@kuro.com.ar
              </a>
            </p>
          </section>

          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-accent-muted">
              <strong>Responsable:</strong> KURO
              <br />
              <strong>Dirección:</strong> Morón, Buenos Aires, Argentina
              <br />
              <strong>RNBD:</strong> [Número de registro - completar]
            </p>
          </div>
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
