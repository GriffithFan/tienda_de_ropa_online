import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Schema de validacion para ordenes de transferencia
 */
const transferOrderSchema = z.object({
  // Datos personales
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    dni: z.string().min(7),
  }),

  // Direccion de envio
  shipping: z.object({
    method: z.string(),
    address: z
      .object({
        street: z.string().min(3),
        number: z.string().min(1),
        floor: z.string().optional(),
        apartment: z.string().optional(),
        city: z.string().min(2),
        province: z.string().min(2),
        postalCode: z.string().min(4),
      })
      .optional(),
  }),

  // Items del carrito
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      size: z.string(),
      color: z.string(),
    })
  ),

  // Totales
  subtotal: z.number(),
  shippingCost: z.number(),
  discount: z.number(),
  total: z.number(),
});

type TransferOrder = z.infer<typeof transferOrderSchema>;

/**
 * POST /api/orders/transfer
 * Crea una orden para pago por transferencia bancaria
 * 
 * El cliente debera realizar la transferencia y enviar el comprobante
 * por email o WhatsApp para confirmar el pedido
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar los datos de la orden
    const validation = transferOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de orden invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const orderData: TransferOrder = validation.data;

    // Generar ID de orden unico
    const orderId = `KIRA-${Date.now().toString(36).toUpperCase()}-TF`;

    // En produccion, guardar en base de datos
    const order = {
      id: orderId,
      ...orderData,
      paymentMethod: 'transfer',
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 horas para pagar
    };

    console.log('Nueva orden por transferencia:', order);

    // TODO: Guardar en base de datos
    // await db.orders.create({ data: order });

    // TODO: Enviar email con instrucciones de pago
    // await sendTransferInstructions(order);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      expiresAt: order.expiresAt,
      message: 'Orden creada. Realiza la transferencia y envía el comprobante.',
    });
  } catch (error) {
    console.error('Error creando orden por transferencia:', error);

    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/transfer?orderId=XXX
 * Obtiene el estado de una orden por transferencia
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de orden requerido' },
        { status: 400 }
      );
    }

    // TODO: Buscar en base de datos
    // const order = await db.orders.findUnique({ where: { id: orderId } });

    // Respuesta de ejemplo
    const order = {
      id: orderId,
      status: 'pending_payment',
      total: 45000,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error obteniendo orden:', error);

    return NextResponse.json(
      { error: 'Error al obtener la orden' },
      { status: 500 }
    );
  }
}
