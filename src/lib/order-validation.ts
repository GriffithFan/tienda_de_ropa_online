import prisma from '@/lib/prisma';
import { MAX_CART_QUANTITY, PAYMENT_CONFIG, SHIPPING_CONFIG } from '@/lib/constants';

type PrismaClientLike = Pick<typeof prisma, 'product'>;

export type OrderPaymentMethod = 'MERCADOPAGO' | 'TRANSFER' | 'CASH';

export interface OrderCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
}

export interface OrderShippingInput {
  method: string;
  address?: {
    street: string;
    number: string;
    floor?: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface ValidatedOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image?: string;
  stockSource: 'size' | 'product';
}

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderValidationError';
  }
}

export async function validateAndPriceOrder(
  db: PrismaClientLike,
  items: OrderItemInput[],
  paymentMethod: OrderPaymentMethod
) {
  if (!items.length) {
    throw new OrderValidationError('El carrito esta vacio');
  }

  const normalizedItems = items.map((item) => ({
    productId: item.productId,
    quantity: Math.trunc(Number(item.quantity)),
    size: item.size?.trim() || 'Unico',
    color: item.color?.trim() || 'Default',
  }));

  for (const item of normalizedItems) {
    if (!item.productId || item.quantity < 1 || item.quantity > MAX_CART_QUANTITY) {
      throw new OrderValidationError('Cantidad invalida en el carrito');
    }
  }

  const uniqueIds = Array.from(new Set(normalizedItems.map((item) => item.productId)));
  const products = await db.product.findMany({
    where: {
      id: { in: uniqueIds },
      isActive: true,
    },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      sizes: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const validatedItems: ValidatedOrderItem[] = normalizedItems.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new OrderValidationError('Uno de los productos ya no esta disponible');
    }

    const sizeStock = product.sizes.find((size) => size.size === item.size);
    const availableStock = sizeStock ? sizeStock.stock : product.stock;

    if (availableStock < item.quantity) {
      throw new OrderValidationError(`Stock insuficiente para ${product.name}`);
    }

    return {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.images[0]?.url,
      stockSource: sizeStock ? 'size' : 'product',
    };
  });

  const subtotal = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= SHIPPING_CONFIG.freeShippingThreshold ? 0 : 5000;
  const discountPercent =
    paymentMethod === 'TRANSFER'
      ? PAYMENT_CONFIG.transferDiscount
      : paymentMethod === 'CASH'
        ? PAYMENT_CONFIG.cashDiscount
        : 0;
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal + shippingCost - discount;

  return {
    items: validatedItems,
    subtotal,
    shippingCost,
    discount,
    total,
  };
}

export function createOrderNumber(suffix?: string) {
  const base = `KURO-${Date.now().toString(36).toUpperCase()}`;
  return suffix ? `${base}-${suffix}` : base;
}