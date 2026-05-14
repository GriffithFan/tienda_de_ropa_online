import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  createOrderNumber,
  OrderValidationError,
  validateAndPriceOrder,
} from '@/lib/order-validation';

/**
 * Inicializacion del cliente de MercadoPago
 * El access token debe configurarse en las variables de entorno
 */
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

const mercadoPagoOrderSchema = z.object({
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

/**
 * POST /api/checkout/mercadopago
 * Crea una preferencia de pago en MercadoPago
 * 
 * @param request - Request con los items del carrito y datos del comprador
 * @returns URL de checkout de MercadoPago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = mercadoPagoOrderSchema.safeParse(body);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de checkout invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { customer, shipping, items } = validation.data;

    const { order, pricedOrder } = await prisma.$transaction(async (tx) => {
      const priced = await validateAndPriceOrder(tx, items, 'MERCADOPAGO');

      for (const item of priced.items) {
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

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: createOrderNumber('MP'),
          customerEmail: customer.email,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerPhone: customer.phone,
          customerDni: customer.dni,
          paymentMethod: 'MERCADOPAGO',
          shippingMethod: shipping.method,
          shippingAddress: shipping.address,
          subtotal: priced.subtotal,
          shippingCost: priced.shippingCost,
          discount: priced.discount,
          total: priced.total,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          items: {
            create: priced.items.map((item) => ({
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
      });

      return { order: createdOrder, pricedOrder: priced };
    });

    const preference = new Preference(client);
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
    const phoneParts = customer.phone.replace(/\D/g, '');
    
    const preferenceBody: Record<string, unknown> = {
      items: pricedOrder.items.map((item) => ({
        id: item.productId,
        title: `${item.name} - ${item.size}`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS' as const,
        picture_url: item.image,
      })),
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        phone: {
          area_code: phoneParts.slice(0, 2),
          number: phoneParts.slice(2),
        },
        identification: {
          type: 'DNI',
          number: customer.dni,
        },
        address: shipping.address
          ? {
              street_name: shipping.address.street,
              street_number: shipping.address.number,
              zip_code: shipping.address.postalCode,
            }
          : undefined,
      },
      external_reference: order.orderNumber,
      statement_descriptor: 'KURO STORE',
    };

    if (!isLocalhost) {
      preferenceBody.back_urls = {
        success: `${baseUrl}/checkout/confirmacion`,
        failure: `${baseUrl}/checkout?error=payment_failed`,
        pending: `${baseUrl}/checkout/pendiente`,
      };
      preferenceBody.auto_return = 'approved';
    }

    const preferenceData = await preference.create({ body: preferenceBody as Parameters<typeof preference.create>[0]['body'] });

    return NextResponse.json({
      id: preferenceData.id,
      orderId: order.orderNumber,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error: unknown) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('MercadoPago preference creation failed:', error);

    const mpError = error as { code?: string; message?: string };
    
    if (mpError?.code === 'unauthorized' || mpError?.message?.includes('invalid access token')) {
      return NextResponse.json(
        { error: 'Credenciales de MercadoPago inválidas o expiradas. Contacta al administrador.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar el pago. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
