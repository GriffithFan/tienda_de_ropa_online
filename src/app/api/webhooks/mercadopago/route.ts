import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      const orderId = paymentData.external_reference;
      const status = paymentData.status;

      if (!orderId) {
        // Pago sin referencia de orden - ignorar
        return NextResponse.json({ received: true });
      }

      const order = await prisma.order.findUnique({
        where: { orderNumber: orderId },
      });

      if (!order) {
        // Orden no encontrada - ignorar
        return NextResponse.json({ received: true });
      }

      switch (status) {
        case 'approved':
          await prisma.order.update({
            where: { orderNumber: orderId },
            data: {
              status: 'CONFIRMED',
              paymentStatus: 'APPROVED',
              paymentId: paymentId.toString(),
              paidAt: new Date(),
            },
          });
          await sendConfirmationEmail(order.customerEmail, orderId);
          break;

        case 'pending':
          await prisma.order.update({
            where: { orderNumber: orderId },
            data: { paymentStatus: 'PENDING' },
          });
          break;

        case 'rejected':
          await prisma.order.update({
            where: { orderNumber: orderId },
            data: { paymentStatus: 'REJECTED' },
          });
          break;

        case 'refunded':
          await prisma.order.update({
            where: { orderNumber: orderId },
            data: {
              status: 'REFUNDED',
              paymentStatus: 'REFUNDED',
            },
          });
          break;

        case 'cancelled':
          await prisma.order.update({
            where: { orderNumber: orderId },
            data: {
              status: 'CANCELLED',
              paymentStatus: 'CANCELLED',
            },
          });
          break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de MercadoPago:', error);
    return NextResponse.json({ received: true });
  }
}

async function sendConfirmationEmail(email: string, orderId: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: 'KURO <pedidos@kuro.com.ar>',
      to: email,
      subject: `Pedido confirmado - ${orderId}`,
      html: `
        <h1>Gracias por tu compra!</h1>
        <p>Tu pedido <strong>${orderId}</strong> ha sido confirmado.</p>
        <p>Te enviaremos otro email cuando tu pedido sea despachado.</p>
        <p>Saludos,<br />KURO</p>
      `,
    });
  } catch (error) {
    console.error('Error enviando email de confirmacion:', error);
  }
}
