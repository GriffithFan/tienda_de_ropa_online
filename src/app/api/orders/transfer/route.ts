import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  createOrderNumber,
  OrderValidationError,
  validateAndPriceOrder,
} from '@/lib/order-validation';
import { rateLimit } from '@/lib/rate-limit';

const transferOrderSchema = z.object({
  paymentMethod: z.enum(['TRANSFER', 'CASH']).default('TRANSFER'),
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
      quantity: z.number().int().min(1),
      size: z.string(),
      color: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      keyPrefix: 'orders:transfer:post',
      limit: 10,
      windowMs: 60_000,
    });

    if (limited) return limited;

    const body = await request.json();
    const validation = transferOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de orden invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { customer, shipping, items, paymentMethod } = validation.data;

    const order = await prisma.$transaction(async (tx) => {
      const pricedOrder = await validateAndPriceOrder(tx, items, paymentMethod);

      for (const item of pricedOrder.items) {
        const productUpdate = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (productUpdate.count !== 1) {
          throw new OrderValidationError(`Stock insuficiente para ${item.name}`);
        }

        if (item.stockSource === 'size') {
          const sizeUpdate = await tx.productSize.updateMany({
            where: {
              productId: item.productId,
              size: item.size,
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          });

          if (sizeUpdate.count !== 1) {
            throw new OrderValidationError(`Stock insuficiente para ${item.name}`);
          }
        }
      }

      return tx.order.create({
        data: {
          orderNumber: createOrderNumber(paymentMethod === 'TRANSFER' ? 'TF' : 'EF'),
          customerEmail: customer.email,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerPhone: customer.phone,
          customerDni: customer.dni,
          paymentMethod,
          shippingMethod: shipping.method,
          shippingAddress: shipping.address,
          subtotal: pricedOrder.subtotal,
          shippingCost: pricedOrder.shippingCost,
          discount: pricedOrder.discount,
          total: pricedOrder.total,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          items: {
            create: pricedOrder.items.map((item) => ({
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
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
      total: Number(order.total),
      expiresAt: order.expiresAt,
      message: 'Orden creada. Realiza la transferencia y envia el comprobante.',
    });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error creando orden por transferencia:', error);
    return NextResponse.json(
      { error: 'Error al crear la orden' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, {
      keyPrefix: 'orders:transfer:get',
      limit: 30,
      windowMs: 60_000,
    });

    if (limited) return limited;

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    if (!orderId || !email) {
      return NextResponse.json(
        { error: 'ID de orden y email requeridos' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: {
        items: true,
      },
    });

    if (!order || order.customerEmail.toLowerCase() !== email.toLowerCase()) {
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
