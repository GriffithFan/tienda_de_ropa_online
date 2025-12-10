import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const transferOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    dni: z.string().min(7),
  }),
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
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      size: z.string(),
      color: z.string(),
      image: z.string().optional(),
    })
  ),
  subtotal: z.number(),
  shippingCost: z.number(),
  discount: z.number(),
  total: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = transferOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de orden invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { customer, shipping, items, subtotal, shippingCost, discount, total } = validation.data;

    const orderNumber = `KIRA-${Date.now().toString(36).toUpperCase()}-TF`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
        customerDni: customer.dni,
        paymentMethod: 'TRANSFER',
        shippingMethod: shipping.method,
        shippingAddress: shipping.address,
        subtotal,
        shippingCost,
        discount,
        total,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
      expiresAt: order.expiresAt,
      message: 'Orden creada. Realiza la transferencia y envia el comprobante.',
    });
  } catch (error) {
    console.error('Error creando orden por transferencia:', error);
    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 }
    );
  }
}

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

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
      expiresAt: order.expiresAt,
      items: order.items,
    });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    return NextResponse.json(
      { error: 'Error al obtener la orden' },
      { status: 500 }
    );
  }
}
