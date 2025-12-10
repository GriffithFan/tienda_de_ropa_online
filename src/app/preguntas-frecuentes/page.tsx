'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Pagina de Preguntas Frecuentes
 * FAQ organizado por categorias
 */
export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const faqCategories = [
    {
      title: 'Pedidos y Compras',
      items: [
        {
          id: 'pedido-1',
          question: '¿Cómo puedo realizar un pedido?',
          answer:
            'Navega por nuestro catálogo, agrega los productos al carrito, selecciona talle y color, y procede al checkout. Completa tus datos y elige el método de pago.',
        },
        {
          id: 'pedido-2',
          question: '¿Puedo modificar mi pedido después de confirmarlo?',
          answer:
            'Si aún no fue despachado, contactanos por WhatsApp lo antes posible y haremos lo posible por modificarlo. Una vez enviado, no es posible realizar cambios.',
        },
        {
          id: 'pedido-3',
          question: '¿Cómo sé si mi pedido fue confirmado?',
          answer:
            'Recibirás un email de confirmación con el número de orden y los detalles de tu compra. También podés verlo en la sección "Mis Pedidos" si tenés cuenta.',
        },
      ],
    },
    {
      title: 'Pagos',
      items: [
        {
          id: 'pago-1',
          question: '¿Qué medios de pago aceptan?',
          answer:
            'Aceptamos tarjetas de crédito y débito (via MercadoPago), transferencia bancaria (10% de descuento), efectivo al retirar (10% de descuento), y Rapipago/Pago Fácil.',
        },
        {
          id: 'pago-2',
          question: '¿Puedo pagar en cuotas?',
          answer:
            'Sí, a través de MercadoPago podés pagar en hasta 12 cuotas con tarjeta de crédito. Las cuotas sin interés dependen de las promociones vigentes.',
        },
        {
          id: 'pago-3',
          question: '¿Cómo funciona el pago por transferencia?',
          answer:
            'Al elegir transferencia, te mostramos los datos bancarios. Realizás la transferencia y nos enviás el comprobante por WhatsApp o email. Una vez verificado, confirmamos tu pedido.',
        },
        {
          id: 'pago-4',
          question: '¿Es seguro comprar en el sitio?',
          answer:
            'Sí, todos los pagos son procesados de forma segura por MercadoPago. No almacenamos datos de tarjetas en nuestros servidores.',
        },
      ],
    },
    {
      title: 'Envíos',
      items: [
        {
          id: 'envio-1',
          question: '¿Hacen envíos a todo el país?',
          answer:
            'Sí, realizamos envíos a todo Argentina a través de Andreani y Correo Argentino.',
        },
        {
          id: 'envio-2',
          question: '¿Cuánto tarda en llegar mi pedido?',
          answer:
            'Los tiempos estimados son: CABA y GBA 2-4 días hábiles, Interior 4-7 días hábiles. Pueden variar según disponibilidad y zona.',
        },
        {
          id: 'envio-3',
          question: '¿El envío es gratis?',
          answer:
            'Sí, el envío es gratis en compras superiores a $50.000. Para montos menores, el costo se calcula según tu ubicación.',
        },
        {
          id: 'envio-4',
          question: '¿Puedo retirar en local?',
          answer:
            'Sí, podés retirar tu pedido sin cargo en nuestro local de Morón, Buenos Aires. Coordinaremos día y horario por WhatsApp.',
        },
        {
          id: 'envio-5',
          question: '¿Cómo hago seguimiento de mi envío?',
          answer:
            'Una vez despachado tu pedido, te enviamos por email el código de seguimiento para que puedas rastrearlo en la web del correo.',
        },
      ],
    },
    {
      title: 'Talles y Productos',
      items: [
        {
          id: 'talle-1',
          question: '¿Cómo sé qué talle me corresponde?',
          answer:
            'En cada producto encontrás una guía de talles. También podés consultar nuestra página de Guía de Talles con tablas de medidas detalladas.',
        },
        {
          id: 'talle-2',
          question: '¿Los colores son exactos a las fotos?',
          answer:
            'Hacemos todo lo posible para que las fotos representen fielmente los colores, pero pueden variar levemente según la configuración de tu monitor.',
        },
        {
          id: 'talle-3',
          question: '¿Cómo debo cuidar las prendas?',
          answer:
            'Recomendamos lavar a mano o en ciclo delicado con agua fría, secar a la sombra y no usar secadora. Encontrarás instrucciones específicas en cada producto.',
        },
      ],
    },
    {
      title: 'Cambios y Devoluciones',
      items: [
        {
          id: 'cambio-1',
          question: '¿Puedo cambiar un producto?',
          answer:
            'Sí, aceptamos cambios dentro de los 30 días de la compra. El producto debe estar sin uso, con etiquetas y en su empaque original.',
        },
        {
          id: 'cambio-2',
          question: '¿Cómo solicito un cambio?',
          answer:
            'Contactanos por WhatsApp o email indicando tu número de pedido y el motivo del cambio. Te indicaremos los pasos a seguir.',
        },
        {
          id: 'cambio-3',
          question: '¿Quién paga el envío del cambio?',
          answer:
            'Si el cambio es por talle o preferencia personal, el costo del envío corre por cuenta del cliente. Si el producto tiene defecto, nos hacemos cargo.',
        },
        {
          id: 'cambio-4',
          question: '¿Puedo devolver un producto y que me reembolsen?',
          answer:
            'Sí, dentro de los 10 días de recibido podés ejercer tu derecho de arrepentimiento. Te reembolsaremos el importe por el mismo medio de pago.',
        },
      ],
    },
  ];

  // Filtrar FAQs por búsqueda
  const filteredCategories = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          items: category.items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : faqCategories;

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
            <span className="text-accent">Preguntas Frecuentes</span>
          </nav>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8" />
            <h1 className="section-title">Preguntas Frecuentes</h1>
          </div>
          <p className="text-accent-muted mt-2">
            Encontrá respuestas a las dudas más comunes
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="container-custom py-8">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-muted" />
            <input
              type="text"
              placeholder="Buscar en las preguntas frecuentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto text-accent-muted mb-4" />
              <p className="text-accent-muted">
                No encontramos resultados para tu búsqueda
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-display text-xl font-bold mb-4">
                  {category.title}
                </h2>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface/50 transition-colors"
                      >
                        <span className="font-medium pr-4">{item.question}</span>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 flex-shrink-0 transition-transform',
                            openItems.includes(item.id) && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {openItems.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4">
                              <p className="text-accent-muted">{item.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-surface rounded-xl text-center">
          <h3 className="font-display text-lg font-bold mb-2">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-accent-muted mb-4">
            Contactanos y te ayudamos con tu consulta
          </p>
          <Link href="/contacto" className="btn-primary">
            Ir a Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
