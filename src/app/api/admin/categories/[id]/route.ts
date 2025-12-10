import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')).nullable(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoria no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar slug unico si se esta cambiando
    if (validation.data.slug) {
      const existing = await prisma.category.findFirst({
        where: {
          slug: validation.data.slug,
          id: { not: params.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Ya existe una categoria con ese slug' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...validation.data,
        image: validation.data.image || null,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error actualizando categoria:', error);
    return NextResponse.json({ error: 'Error al actualizar categoria' }, { status: 500 });
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

    // Verificar si tiene productos
    const productsCount = await prisma.product.count({
      where: { categoryId: params.id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: tiene ${productsCount} productos asociados` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando categoria:', error);
    return NextResponse.json({ error: 'Error al eliminar categoria' }, { status: 500 });
  }
}
