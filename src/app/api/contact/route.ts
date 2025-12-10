import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email invalido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Asunto muy corto'),
  message: z.string().min(10, 'Mensaje muy corto'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      await resend.emails.send({
        from: 'KIRA Store <noreply@kirastore.com>',
        to: process.env.CONTACT_EMAIL,
        subject: `Contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });
    }

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
