import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Schema de validacion para el formulario de contacto
 */
const contactSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email invalido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Asunto muy corto'),
  message: z.string().min(10, 'Mensaje muy corto'),
});

type ContactForm = z.infer<typeof contactSchema>;

/**
 * POST /api/contact
 * Procesa el formulario de contacto
 * 
 * Envia un email con el mensaje del cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos del formulario
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const formData: ContactForm = validation.data;

    console.log('Nuevo mensaje de contacto:', formData);

    // TODO: Implementar envio de email con Resend, SendGrid, etc.
    // await resend.emails.send({
    //   from: 'noreply@kirastore.com',
    //   to: 'contacto@kirastore.com',
    //   subject: `Contacto: ${formData.subject}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${formData.name}</p>
    //     <p><strong>Email:</strong> ${formData.email}</p>
    //     <p><strong>Telefono:</strong> ${formData.phone || 'No proporcionado'}</p>
    //     <p><strong>Asunto:</strong> ${formData.subject}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${formData.message}</p>
    //   `,
    // });

    // Simular delay de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
    });
  } catch (error) {
    console.error('Error procesando contacto:', error);

    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    );
  }
}
