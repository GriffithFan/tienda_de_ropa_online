'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Schema de validacion para el formulario de contacto
 */
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email valido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z
    .string()
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Pagina de contacto
 * Incluye formulario de contacto e informacion de la tienda
 */
export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // TODO: Implementar envio real via API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();

    // Reset estado despues de 5 segundos
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-custom py-8">
          <nav className="text-sm text-accent-muted mb-4">
            <a href="/" className="hover:text-accent">
              Inicio
            </a>
            <span className="mx-2">/</span>
            <span className="text-accent">Contacto</span>
          </nav>
          <h1 className="section-title">Contacto</h1>
          <p className="section-subtitle mt-2">
            Estamos para ayudarte. Comunicate con nosotros por el medio que
            prefieras.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informacion de contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-bold text-xl mb-6">
                Informacion de contacto
              </h2>

              <div className="space-y-6">
                <ContactInfo
                  icon={MessageCircle}
                  title="WhatsApp"
                  content={SITE_CONFIG.phone}
                  link={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  description="Atencion de Lunes a Viernes de 9 a 18hs"
                />
                <ContactInfo
                  icon={Mail}
                  title="Email"
                  content={SITE_CONFIG.email}
                  link={`mailto:${SITE_CONFIG.email}`}
                  description="Respondemos en menos de 24hs"
                />
                <ContactInfo
                  icon={Phone}
                  title="Telefono"
                  content={SITE_CONFIG.phone}
                  link={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                  description="Llamanos en horario comercial"
                />
                <ContactInfo
                  icon={MapPin}
                  title="Direccion"
                  content={`${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.city}`}
                  description="Solo con cita previa"
                />
              </div>
            </div>

            {/* Horarios */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios de atencion
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-accent-muted">Lunes a Viernes</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-muted">Sabados</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent-muted">Domingos y Feriados</span>
                  <span className="text-error">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="font-display font-bold text-lg mb-4">
                Seguinos en redes
              </h3>
              <div className="flex gap-3">
                <a
                  href={SITE_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div>
            <div className="card p-6 lg:p-8">
              <h2 className="font-display font-bold text-xl mb-6">
                Enviar mensaje
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-success/20">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    Mensaje enviado
                  </h3>
                  <p className="text-accent-muted">
                    Recibimos tu mensaje. Te responderemos a la brevedad.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nombre */}
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">
                      Nombre completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      {...register('name')}
                      className={cn(errors.name && 'border-error')}
                    />
                    {errors.name && (
                      <span className="input-error">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      {...register('email')}
                      className={cn(errors.email && 'border-error')}
                    />
                    {errors.email && (
                      <span className="input-error">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Telefono */}
                  <div className="input-group">
                    <label htmlFor="phone" className="input-label">
                      Telefono (opcional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="11 1234-5678"
                      {...register('phone')}
                    />
                  </div>

                  {/* Asunto */}
                  <div className="input-group">
                    <label htmlFor="subject" className="input-label">
                      Asunto *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Consulta sobre..."
                      {...register('subject')}
                      className={cn(errors.subject && 'border-error')}
                    />
                    {errors.subject && (
                      <span className="input-error">{errors.subject.message}</span>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className="input-group">
                    <label htmlFor="message" className="input-label">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Escribe tu mensaje..."
                      {...register('message')}
                      className={cn(errors.message && 'border-error')}
                    />
                    {errors.message && (
                      <span className="input-error">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Boton enviar */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de informacion de contacto
 */
interface ContactInfoProps {
  icon: React.ElementType;
  title: string;
  content: string;
  link?: string;
  description?: string;
}

function ContactInfo({
  icon: Icon,
  title,
  content,
  link,
  description,
}: ContactInfoProps) {
  const ContentWrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <ContentWrapper
          {...wrapperProps}
          className={cn(
            'text-accent-muted',
            link && 'hover:text-accent transition-colors'
          )}
        >
          {content}
        </ContentWrapper>
        {description && (
          <p className="text-xs text-accent-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
