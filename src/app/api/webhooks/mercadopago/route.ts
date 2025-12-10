import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

/**
 * Cliente de MercadoPago para verificar pagos
 */
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

/**
 * POST /api/webhooks/mercadopago
 * Webhook para recibir notificaciones de MercadoPago
 * 
 * Este endpoint es llamado por MercadoPago cuando hay actualizaciones
 * en el estado de un pago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar el tipo de notificacion
    const { type, data } = body;

    // Solo procesamos notificaciones de pagos
    if (type === 'payment') {
      const paymentId = data.id;

      // Obtener los detalles del pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      // Obtener la referencia externa (ID de orden)
      const orderId = paymentData.external_reference;
      const status = paymentData.status;

      console.log(`Pago ${paymentId} para orden ${orderId}: ${status}`);

      // Actualizar el estado de la orden segun el estado del pago
      switch (status) {
        case 'approved':
          // Pago aprobado - confirmar la orden
          await updateOrderStatus(orderId!, 'confirmed');
          // Enviar email de confirmacion
          await sendConfirmationEmail(orderId!);
          break;

        case 'pending':
          // Pago pendiente (ej: Rapipago, Pago Facil)
          await updateOrderStatus(orderId!, 'pending_payment');
          break;

        case 'in_process':
          // En revision
          await updateOrderStatus(orderId!, 'in_review');
          break;

        case 'rejected':
          // Pago rechazado
          await updateOrderStatus(orderId!, 'payment_failed');
          break;

        case 'refunded':
          // Pago reembolsado
          await updateOrderStatus(orderId!, 'refunded');
          break;

        case 'cancelled':
          // Pago cancelado
          await updateOrderStatus(orderId!, 'cancelled');
          break;

        default:
          console.log(`Estado de pago desconocido: ${status}`);
      }
    }

    // Responder con 200 para confirmar recepcion
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de MercadoPago:', error);

    // Aun asi respondemos 200 para evitar reintentos
    return NextResponse.json({ received: true });
  }
}

/**
 * Actualiza el estado de una orden en la base de datos
 * En produccion, esto deberia conectarse a tu base de datos
 * 
 * @param orderId - ID de la orden
 * @param status - Nuevo estado de la orden
 */
async function updateOrderStatus(orderId: string, status: string) {
  // TODO: Implementar con tu base de datos (Prisma, MongoDB, etc.)
  console.log(`Actualizando orden ${orderId} a estado: ${status}`);
}

/**
 * Envia un email de confirmacion al cliente
 * En produccion, esto deberia usar un servicio como SendGrid, Resend, etc.
 * 
 * @param orderId - ID de la orden
 */
async function sendConfirmationEmail(orderId: string) {
  // TODO: Implementar envio de email
  console.log(`Enviando email de confirmacion para orden ${orderId}`);
}
