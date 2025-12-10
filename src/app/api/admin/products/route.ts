import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema flexible para aceptar ambos formatos
const productSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'Slug debe tener al menos 2 caracteres'),
  description: z.string().min(3, 'Descripcion debe tener al menos 3 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().nullable().optional(),
  compareAtPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, 'Categoria es requerida'),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  // Aceptar array de strings O array de objetos para images
  images: z.array(
    z.union([
      z.string(),
      z.object({ url: z.string(), alt: z.string().optional() })
    ])
  ).default([]),
  // Aceptar array de strings O array de objetos para sizes
  sizes: z.array(
    z.union([
      z.string(),
      z.object({ size: z.string(), stock: z.number().int().min(0) })
    ])
  ).default([]),
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

    const { images, sizes, colors, originalPrice, ...productData } = validation.data;

    // Normalizar images: convertir strings a objetos
    const normalizedImages = images.map((img, index) => {
      if (typeof img === 'string') {
        return { url: img, alt: '', order: index };
      }
      return { url: img.url, alt: img.alt || '', order: index };
    }).filter(img => img.url && img.url.trim() !== '');

    // Normalizar sizes: convertir strings a objetos con stock del producto
    const normalizedSizes = sizes.map((s) => {
      if (typeof s === 'string') {
        return { size: s, stock: productData.stock || 0 };
      }
      return { size: s.size, stock: s.stock };
    });

    const product = await prisma.product.create({
      data: {
        ...productData,
        compareAtPrice: originalPrice || productData.compareAtPrice || null,
        images: {
          create: normalizedImages,
        },
        sizes: {
          create: normalizedSizes,
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
