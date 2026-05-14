import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const imageSchema = z.union([
  z.string(),
  z.object({
    url: z.string(),
    alt: z.string().optional(),
  }),
]);

const sizeSchema = z.union([
  z.string(),
  z.object({
    size: z.string(),
    stock: z.number().int().min(0),
  }),
]);

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().optional(),
  hexCode: z.string().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido').optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  originalPrice: z.union([z.number(), z.null()]).optional(),
  compareAtPrice: z.union([z.number().positive(), z.null()]).optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
  sizes: z.array(sizeSchema).optional(),
  colors: z.array(colorSchema).optional(),
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        sizes: true,
        colors: true,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

async function handleUpdate(request: NextRequest, productId: string) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { images, sizes, colors, originalPrice, ...updateData } = validation.data;

    // Preparar datos de actualizacion
    const data: Record<string, unknown> = {
      ...updateData,
    };

    if (originalPrice !== undefined && originalPrice !== null && originalPrice > 0) {
      data.compareAtPrice = originalPrice;
    }

    // Actualizar producto
    const product = await prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true,
        images: true,
        sizes: true,
        colors: true,
      },
    });

    // Si se enviaron images, actualizarlas
    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId } });
      
      const normalizedImages = images.map((img, index) => {
        if (typeof img === 'string') {
          return { url: img, alt: '', order: index, productId };
        }
        return { url: img.url, alt: img.alt || '', order: index, productId };
      }).filter(img => img.url && img.url.trim() !== '');

      if (normalizedImages.length > 0) {
        await prisma.productImage.createMany({ data: normalizedImages });
      }
    }

    // Si se enviaron sizes, actualizarlas
    if (sizes && sizes.length > 0) {
      await prisma.productSize.deleteMany({ where: { productId } });
      
      const normalizedSizes = sizes.map((s) => {
        if (typeof s === 'string') {
          return { size: s, stock: product.stock || 0, productId };
        }
        return { size: s.size, stock: s.stock, productId };
      });

      await prisma.productSize.createMany({ data: normalizedSizes });
    }

    if (colors && colors.length > 0) {
      await prisma.productColor.deleteMany({ where: { productId } });

      const normalizedColors = colors
        .map((color) => ({
          name: color.name,
          hex: color.hex || color.hexCode || '#000000',
          productId,
        }))
        .filter((color) => color.name.trim() !== '');

      if (normalizedColors.length > 0) {
        await prisma.productColor.createMany({ data: normalizedColors });
      }
    }

    // Obtener producto actualizado con relaciones
    const updatedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: true,
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
