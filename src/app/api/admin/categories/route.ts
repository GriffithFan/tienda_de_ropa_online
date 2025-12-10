import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
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
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invalidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar slug unico
    const existing = await prisma.category.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una categoria con ese slug' },
        { status: 400 }
      );
    }

    // Obtener el orden maximo
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    });

    const category = await prisma.category.create({
      data: {
        ...validation.data,
        image: validation.data.image || null,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creando categoria:', error);
    return NextResponse.json({ error: 'Error al crear categoria' }, { status: 500 });
  }
}
