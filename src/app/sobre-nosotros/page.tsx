'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, Users, Truck } from 'lucide-react';

/**
 * Pagina Sobre Nosotros
 * Historia y valores de la marca
 */
export default function SobreNosotrosPage() {
  const values = [
    {
      icon: Sparkles,
      title: 'Diseño Único',
      description:
        'Cada prenda es pensada para quienes buscan diferenciarse, con diseños que fusionan lo alternativo y la estética japonesa.',
    },
    {
      icon: Heart,
      title: 'Pasión por la Moda',
      description:
        'Amamos lo que hacemos. Cada colección nace de nuestra pasión por la moda urbana y la cultura japonesa.',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description:
        'Más que clientes, somos una comunidad de personas que comparten una estética y forma de expresión.',
    },
    {
      icon: Truck,
      title: 'Compromiso',
      description:
        'Nos comprometemos con la calidad de nuestros productos y la satisfacción de quienes eligen KIRA.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-surface flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-accent-muted max-w-2xl mx-auto">
            Ropa alternativa con esencia japonesa
          </p>
        </motion.div>
      </div>

      {/* Historia */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold mb-6">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-accent-muted">
              <p>
                KIRA nació de una pasión compartida por la moda alternativa y la
                cultura japonesa. Lo que empezó como un proyecto personal se
                convirtió en una marca que representa a quienes buscan expresarse
                a través de su vestimenta.
              </p>
              <p>
                Nos inspiramos en el streetwear japonés, el anime, y las
                subculturas urbanas para crear prendas que no encontrás en
                cualquier lado. Cada diseño cuenta una historia y está pensado
                para quienes se animan a ser diferentes.
              </p>
              <p>
                Desde Buenos Aires para todo el país, seguimos creciendo gracias
                a una comunidad que comparte nuestra visión: la moda como forma
                de expresión y pertenencia.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-surface rounded-2xl overflow-hidden"
          >
            {/* Placeholder - Reemplazar con imagen real */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-6xl font-bold text-accent/10">
                KIRA
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-surface py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Nuestros Valores
            </h2>
            <p className="text-accent-muted max-w-2xl mx-auto">
              Lo que nos define y guía cada decisión que tomamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-background rounded-xl text-center"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-accent-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl font-bold mb-6">
            Nuestra Misión
          </h2>
          <p className="text-xl text-accent-muted mb-8">
            Crear ropa que permita a las personas expresar su individualidad,
            inspirados en la estética japonesa y las subculturas urbanas,
            ofreciendo productos de calidad accesibles para toda la comunidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/productos" className="btn-primary">
              Ver Colección
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contacto" className="btn-secondary">
              Contactanos
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Números */}
      <section className="bg-surface py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '2023', label: 'Año de fundación' },
              { number: '1000+', label: 'Clientes felices' },
              { number: '50+', label: 'Diseños únicos' },
              { number: '24hs', label: 'Atención personalizada' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="font-display text-4xl font-bold mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-accent-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Unite a la comunidad KIRA
          </h2>
          <p className="text-accent-muted mb-6 max-w-xl mx-auto">
            Seguinos en redes sociales para ver las últimas novedades, detrás de
            escena y ofertas exclusivas.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com/kirastore"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Seguinos en Instagram
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
