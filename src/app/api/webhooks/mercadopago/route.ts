import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const resend = new Resend(process.env.RESEND_API_KEY);

function verifyWebhookSignature(request: NextRequest, body: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if secret not configured

  const xSignature = request.headers.get('x-signature');
  const xRequestId = request.headers.get('x-request-id');

  if (!xSignature || !xRequestId) return false;

  const parts = xSignature.split(',');
  let ts = '';
  let hash = '';

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key.trim() === 'ts') ts = value.trim();
    if (key.trim() === 'v1') hash = value.trim();
  }

  if (!ts || !hash) return false;

  const dataId = JSON.parse(body).data?.id;
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(expectedHash)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    if (!verifyWebhookSignature(request, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
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
