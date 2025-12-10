import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string(),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0),
  isActive: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
  })).default([]),
  sizes: z.array(z.object({
    size: z.string(),
    stock: z.number().int().min(0),
  })).default([]),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string(),
  })).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { order: 'asc' }, take: 1 },
          _count: { select: { orderItems: true, reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { images, sizes, colors, ...productData } = validation.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            order: index,
          })),
        },
        sizes: {
          create: sizes.map((s) => ({
            size: s.size,
            stock: s.stock,
          })),
        },
        colors: {
          create: colors.map((c) => ({
            name: c.name,
            hex: c.hex,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
