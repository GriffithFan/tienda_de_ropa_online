import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED', 'CANCELLED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        ...order,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        discount: Number(order.discount),
        total: Number(order.total),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const updateData: any = { ...validation.data };

    if (validation.data.status === 'SHIPPED') {
      updateData.shippedAt = new Date();
    } else if (validation.data.status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    if (validation.data.status === 'SHIPPED' && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'KURO <pedidos@kuro.com.ar>',
        to: order.customerEmail,
        subject: `Tu pedido ${order.orderNumber} ha sido enviado`,
        html: `
          <h1>Tu pedido esta en camino!</h1>
          <p>Hola ${order.customerName},</p>
          <p>Tu pedido <strong>${order.orderNumber}</strong> ha sido despachado.</p>
          ${order.trackingNumber ? `<p>Numero de seguimiento: <strong>${order.trackingNumber}</strong></p>` : ''}
          <p>Saludos,<br />KURO</p>
        `,
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    return NextResponse.json({ error: 'Error al actualizar orden' }, { status: 500 });
  }
}
